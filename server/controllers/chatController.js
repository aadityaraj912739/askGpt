import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import AppError from '../utils/appError.js';

// Initialize Gemini AI lazily
let genAI = null;
let initialized = false;

const initializeGemini = () => {
  if (initialized) return;
  initialized = true;
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log(`✓ Gemini AI initialized successfully with model: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`);
    } else {
      console.warn('⚠ Gemini API key not configured - AI responses will be disabled.');
    }
  } catch (error) {
    console.error('✗ Failed to initialize Gemini AI:', error.message);
  }
};

// Find the project root by looking for a package.json or .git file
const findProjectRoot = (startPath) => {
  let currentPath = startPath;
  while (currentPath !== path.parse(currentPath).root) {
    if (fs.existsSync(path.join(currentPath, 'package.json')) || fs.existsSync(path.join(currentPath, '.git'))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }
  return startPath; // Fallback to starting path
};

const walk = (dir, limit, files, repoRoot) => {
  if (files.length >= limit) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (files.length >= limit) break;
    const full = path.join(dir, ent.name);
    if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'dist' || ent.name === 'build') continue;
    if (ent.isDirectory()) {
      walk(full, limit, files, repoRoot);
    } else {
      try {
        const stat = fs.statSync(full);
        if (stat.size > (parseInt(process.env.MAX_FILE_SIZE_KB) || 100) * 1024) return;
        const content = fs.readFileSync(full, 'utf8');
        files.push({ path: path.relative(repoRoot, full), content: content.slice(0, 8 * 1024) });
      } catch (e) {
        // ignore unreadable files
      }
    }
  }
};

const constructCodePrompt = (userMessage) => {
  try {
    const repoRoot = findProjectRoot(path.resolve(process.cwd()));
    const files = [];
    walk(repoRoot, parseInt(process.env.MAX_FILES_TO_SCAN) || 200, files, repoRoot);

    const manifest = files.slice(0, parseInt(process.env.MAX_FILES_IN_MANIFEST) || 40).map(f => `- ${f.path} (${f.content.length} chars)`).join('\n');
    const snippets = files.slice(0, parseInt(process.env.MAX_FILES_IN_SNIPPETS) || 8).map(f => `File: ${f.path}\n----\n${f.content}\n----`).join('\n\n');
    const codeInstructions = `\n\nIMPORTANT INSTRUCTIONS FOR CODE GENERATION:\n- If the user request requires creating or modifying code, respond ONLY with the code files.\n- Wrap each file's content in a triple-backtick fenced block with a language tag (e.g. 
\
\
javascript).\n- At the top of each code block put a single-line comment with the filename like // file: path/to/file.ext (do not add other commentary).\n- Do NOT include any additional explanation, analysis, or prose.\n- If you cannot generate the code, return a short error message starting with ERROR: followed by the reason.\n\n`;
    return `Repository files (short manifest):\n${manifest}\n\nRelevant file snippets:\n${snippets}\n\nUser request:\n${userMessage}${codeInstructions}`;
  } catch (fsErr) {
    console.warn('Failed to gather repo files for prompt:', fsErr.message);
    return userMessage;
  }
};

// Generate AI response using Google Gemini
const generateAIResponse = async (userMessage) => {
  initializeGemini();

  if (!genAI) {
    throw new AppError(
      'The AI service is not configured. Please provide a valid Gemini API key in the .env file.',
      503
    );
  }

  try {
    let prompt = userMessage;
    const codeRequestKeywords = ['generate code', 'create file', 'implement', 'scaffold', 'function', 'class', 'component', 'snippet'];
    const lower = (userMessage || '').toLowerCase();

    if (codeRequestKeywords.some(k => lower.includes(k))) {
      prompt = constructCodePrompt(userMessage);
    }

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

    const withTimeout = (promise, ms) => {
      let id;
      const timeout = new Promise((_, reject) => {
        id = setTimeout(() => reject(new Error('Gemini call timeout')), ms);
      });
      return Promise.race([promise.finally(() => clearTimeout(id)), timeout]);
    };

    try {
      const result = await withTimeout(model.generateContent(prompt), parseInt(process.env.GEMINI_TIMEOUT_MS) || 30000);
      const response = await result.response;
      const text = response.text();
      console.log('✓ Gemini response received');
      return text;
    } catch (innerErr) {
      console.warn('Gemini call failed or timed out:', innerErr.message);
      throw new AppError('The AI service timed out or failed to respond. Please try again later.', 503);
    }
  } catch (error) {
    console.error('Full Gemini API Error:', error);
    if (error.message?.includes('API key')) {
      throw new AppError('The Gemini API key appears to be invalid. Please check your .env file.', 401);
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      throw new AppError('You have exceeded your Gemini API quota. Please check your Google Cloud console.', 429);
    }
    throw new AppError(error.message || 'An unexpected error occurred with the AI service.', 500);
  }
};

// @desc    Send a message and get AI response
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    if (!message) {
      return next(new AppError('Message text is required.', 400));
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return next(new AppError('Conversation not found.', 404));
      }
    } else {
      conversation = await Conversation.create({
        user: userId,
        title: message.substring(0, 50),
      });
    }

    const userMessage = await Message.create({
      conversation: conversation._id,
      sender: 'user',
      text: message,
    });

    conversation.messages.push(userMessage._id);

    const aiResponseText = await generateAIResponse(message);

    const aiMessage = await Message.create({
      conversation: conversation._id,
      sender: 'ai',
      text: aiResponseText,
    });

    conversation.messages.push(aiMessage._id);
    await conversation.save();

    res.status(200).json({
      status: 'success',
      data: {
        message: aiResponseText,
        conversationId: conversation._id,
        messageId: aiMessage._id,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('messages');

    res.status(200).json({
      status: 'success',
      data: {
        conversations,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('messages');

    if (!conversation) {
      return next(new AppError('Conversation not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        messages: conversation.messages,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new conversation
// @route   POST /api/chat/conversations
// @access  Private
export const createConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.create({
      user: req.user.id,
      title: req.body.title || 'New Conversation'
    });

    res.status(201).json({
      status: 'success',
      data: {
        conversation,
      },
    });
  } catch (error) {
    return next(error);
  }
};

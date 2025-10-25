import { motion } from 'framer-motion';
import { FiUser, FiClipboard, FiCheck, FiCode, FiZap } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import { formatMessageText } from '../utils/format';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-tomorrow.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

// Sexy Gemini Icon
function GeminiIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
      <path d="M12 2.5L14.68 8.32L21.5 9.27L16.75 13.89L17.82 20.5L12 17.25L6.18 20.5L7.25 13.89L2.5 9.27L9.32 8.32L12 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4.5 4.5L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19.5 4.5L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4.5 19.5L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19.5 19.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}


function CodeBlock({ code, lang = 'javascript', filename }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current) Prism.highlightElement(ref.current);
  }, [code, lang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="rounded-md overflow-hidden border border-gray-300 dark:border-gray-700 my-4 bg-gray-50 dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-black/50 px-3 py-2 text-sm">
        <span className="font-mono text-xs text-text-secondary-light dark:text-text-secondary-dark">{filename || lang || 'code'}</span>
        <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition font-semibold">
          <span className="icon-sexy" aria-hidden>
            {copied ? <FiCheck /> : <FiClipboard />}
          </span>
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="line-numbers overflow-auto p-3 m-0">
        <code ref={ref} className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
}

function MonacoCodeBlock({ code, lang = 'javascript', filename }) {
  const [MonacoEditor, setMonacoEditor] = useState(null);
  const [copied, setCopied] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    let mounted = true;
    import('@monaco-editor/react')
      .then(mod => {
        if (mounted) setMonacoEditor(() => mod.default);
      })
      .catch(() => {
        setMonacoEditor(null);
      });
    return () => { mounted = false };
  }, []);

  if (!MonacoEditor) {
    return <CodeBlock code={code} lang={lang} filename={filename} />; 
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return <CodeBlock code={code} lang={lang} filename={filename} />;
}

function MessageActions({ isUser, onCopyText, onCopyCode, codeParts }) {
  const [textCopied, setTextCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyText = () => {
    onCopyText();
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2000);
  }

  const handleCopyCode = () => {
    onCopyCode();
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  return (
    <div className={`absolute bottom-0 mb-2 flex gap-1 transition-opacity duration-300 ${isUser ? 'right-12' : 'left-12'}`}>
      <button onClick={handleCopyText} className="px-2 py-1 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition flex items-center gap-1 text-xs font-semibold">
        <span className="icon-sexy" aria-hidden>
          {textCopied ? <FiCheck size={12} /> : <FiClipboard size={12} />}
        </span>
        {textCopied ? 'Copied' : 'Text'}
      </button>
      {!isUser && codeParts.length > 0 && (
        <button onClick={handleCopyCode} className="px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition flex items-center gap-1 text-xs font-semibold">
          <span className="icon-sexy" aria-hidden>
            {codeCopied ? <FiCheck size={12} /> : <FiCode size={12} />}
          </span>
          {codeCopied ? 'Copied' : 'Code'}
        </button>
      )}
    </div>
  )
}


function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useThemeStore();
  const { user } = useAuthStore();

  const codeFenceRegex = /```([\w+-]+)?\n([\s\S]*?)```/g;

  const parts = [];
  let lastIndex = 0;
  let match;
  
  let text = formatMessageText(message.text || '');

  const fileSnippetRegex = /File:\s*(.+?)\n-----\n([\s\S]*?)\n----/g;
  if (fileSnippetRegex.test(text)) {
    text = text.replace(fileSnippetRegex, (m, file, content) => {
      const ext = (file.split('.').pop() || '').toLowerCase();
      let lang = ext;
      if (ext === 'js' || ext === 'jsx') lang = 'javascript';
      if (ext === 'ts' || ext === 'tsx') lang = 'typescript';
      if (ext === 'py') lang = 'python';
      if (ext === 'csharp' || ext === 'cs') lang = 'csharp';
      if (ext === 'cpp' || ext === 'cc' || ext === 'c++') lang = 'cpp';
      if (!lang) lang = 'text';
      return `\n\`\`\`${lang}\n// file: ${file}\n${content}\n\`\`\`\n`;
    });
  }

  while ((match = codeFenceRegex.exec(text)) !== null) {
    const [full, lang, code] = match;
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, idx) });
    }
    let normalized = (lang || 'javascript').toLowerCase();
    if (normalized === 'ts') normalized = 'typescript';
    if (normalized === 'py') normalized = 'python';
    if (normalized === 'c#' || normalized === 'csharp') normalized = 'csharp';
    if (normalized === 'c++' || normalized === 'cpp') normalized = 'cpp';
    parts.push({ type: 'code', lang: normalized, content: code });
    lastIndex = idx + full.length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  const textParts = parts.filter(p => p.type === 'text');
  const codeParts = parts.filter(p => p.type === 'code');

  const copyFullMessage = () => {
    navigator.clipboard.writeText(textParts.map(p => p.content).join(''));
  }

  const copyAllCode = () => {
    navigator.clipboard.writeText(codeParts.map(p => p.content).join('\n\n'));
  }

  const renderTextPart = (text, keyPrefix = '') => {
    if (!text || String(text).trim().length === 0) return null;

    if (message.sender === 'ai') {
      return (
        <div className="gemini-text" key={keyPrefix}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-text-primary-light dark:text-text-primary-dark leading-relaxed tracking-widest font-sans">
            {text}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <div className="gemini-text" key={keyPrefix}>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary-dark flex items-center justify-center text-white flex-shrink-0">
          <FiZap size={20} />
        </div>
      )}

      <div
        className={`rounded-md pl-8 pr-6 py-4 transition-shadow duration-300 ${isUser
            ? 'max-w-4xl bg-primary-light dark:bg-primary-dark text-white'
            : `bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl ${theme === 'light' ? 'text-black' : 'text-text-primary-dark'} shadow-lg border border-gray-200 dark:border-gray-700`
        }`}
      >
        {parts.length === 0 ? (
          isUser ? (
            <p className="whitespace-pre-wrap">{text}</p>
          ) : (
            renderTextPart(text, 'plain')
          )
        ) : (
          parts.map((part, i) => {
            if (part.type === 'text') {
              return isUser ? (
                <p key={i} className="whitespace-pre-wrap">{part.content}</p>
              ) : (
                renderTextPart(part.content, `part-${i}`)
              );
            }
            return <MonacoCodeBlock key={i} code={part.content} lang={part.lang} />;
          })
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-surface-dark flex items-center justify-center flex-shrink-0">
          <FiUser className="text-gray-600 dark:text-text-secondary-dark" />
        </div>
      )}
      
      {isHovered && (
        <MessageActions 
          isUser={isUser}
          onCopyText={copyFullMessage}
          onCopyCode={copyAllCode}
          codeParts={codeParts}
        />
      )}
    </motion.div>
  );
}

export default MessageBubble;

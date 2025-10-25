import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { chatService } from '../services/chatService';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import { FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Chat() {
  const { messages, isLoading, addMessage, setLoading } = useChatStore();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setLoading(true);

    try {
      const response = await chatService.sendMessage(text);
      console.log('Response from server:', response);
      console.log('Response type:', typeof response);
      console.log('Response.message:', response.message);
      const data = response.data || response;
      const messageText = data?.message;
      const aiText = (typeof messageText === 'string' && messageText.trim()) ? messageText : 'Sorry, I could not generate a response. Please try again.';
      const aiMessage = {
        id: Date.now() + 1,
        text: aiText,
        sender: 'ai',
        timestamp: new Date(),
      };
      console.log('AI message text:', aiMessage.text);
      addMessage(aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-white"
          >
            <FiMessageSquare size={64} className="mb-4 text-purple-400" />
            <h2 className="text-4xl font-bold mb-2">AskGPT</h2>
            <p className="text-lg text-white/80">How can I help you today?</p>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}

export default Chat;
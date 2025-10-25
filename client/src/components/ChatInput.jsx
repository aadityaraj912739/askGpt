import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const { theme } = useThemeStore();
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex gap-10 items-end">
          <div className={`flex-1 p-2 ${theme === 'light' ? 'bg-gray-100 border border-gray-300' : 'glassmorphism'} rounded-none shadow-lg`}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={disabled}
              className={`w-full resize-none bg-transparent border-none focus:ring-0 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed p-2 ${theme === 'light' ? 'text-black placeholder-gray-500' : 'text-white placeholder-white/50'}`}
              style={{ minHeight: '44px', maxHeight: '200px', overflowY: input.split('\n').length > 6 ? 'auto' : 'hidden' }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={disabled || !input.trim()}
            className="w-24 h-14 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm flex items-center justify-center flex-shrink-0 ml-auto"
          >
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
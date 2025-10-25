import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { FiLogOut, FiMessageSquare, FiSun, FiMoon, FiPlus, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useChatStore } from '../store/chatStore';

function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { clearMessages } = useChatStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-64 p-4 flex flex-col ${theme === 'light' ? 'bg-gray-100' : 'glassmorphism'}`}
      >
        <div className="p-4 mb-4 text-center">
          <h1 className={`text-3xl font-bold flex items-center justify-center gap-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
            <FiZap size={32} />
            AskGPT
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 ${theme === 'light' ? 'text-black' : 'text-white'} py-3 rounded-none font-semibold hover:bg-blue-700 transition`}
            onClick={clearMessages}
          >
            <FiPlus size={20} />
            New Chat
          </motion.button>
          {/* Conversation history can go here */}
        </div>

        <div className="flex flex-row items-center justify-center gap-10">
          <button
            onClick={toggleTheme}
            className={`w-16 h-8 flex items-center justify-center bg-blue-600 ${theme === 'light' ? 'text-black' : 'text-white'} rounded-none hover:bg-blue-700 transition font-semibold text-[10px]`}
            title="Toggle Theme"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <div className={`w-16 h-8 bg-blue-600 rounded-none flex items-center justify-center ${theme === 'light' ? 'text-black' : 'text-white'} font-bold text-[10px]`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className={`w-16 h-8 flex items-center justify-center bg-blue-600 ${theme === 'light' ? 'text-black' : 'text-white'} rounded-none hover:bg-blue-700 transition font-semibold text-[10px]`}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${theme === 'light' ? 'bg-white' : 'bg-black/20'}`}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';
import { useThemeStore } from '../store/themeStore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { theme } = useThemeStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      console.log('Login successful, setting auth...', data);
      setAuth(data.user, data.token);
      localStorage.setItem('token', data.token); // Store token for API interceptor
      console.log('Token stored in localStorage:', localStorage.getItem('token') ? 'YES' : 'NO');
      console.log('Navigating to /chat...');
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 glassmorphism rounded-none shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/80">Sign in to continue to AskGPT</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/50 border border-red-700 text-white rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-24 h-12 bg-blue-600 ${theme === 'light' ? 'text-black' : 'text-white'} rounded-none font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 mx-auto`}
          >
            <FiLogIn size={20} />
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-white/80">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
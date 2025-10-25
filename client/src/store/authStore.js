import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,
      setAuth: (user, token) => {
        console.log('setAuth called with user:', user, 'token length:', token?.length);
        localStorage.setItem('token', token); // Store for API interceptor
        set({ user, token, loading: false });
        console.log('Auth state updated');
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, loading: false })
      },
      initialize: async () => {
        console.log('AuthStore initialize called');
        const token = localStorage.getItem('token')
        console.log('Token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');
        if (token) {
          try {
            console.log('Verifying token with /auth/me...');
            // Verify token by fetching user data with token in header
            const response = await api.get('/auth/me')
            console.log('Token verification successful, user:', response.data.data.user);
            set({ user: response.data.data.user, token, loading: false })
          } catch (error) {
            console.log('Token verification failed:', error.response?.data || error.message);
            // Token is invalid, clear it
            localStorage.removeItem('token')
            set({ user: null, token: null, loading: false })
          }
        } else {
          console.log('No token found, setting loading to false');
          set({ loading: false })
        }
      },
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      // Only persist user and token, not loading state
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

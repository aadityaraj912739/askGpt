import api from '../utils/api'

export const authService = {
  register: async (userData) => {
    try {
      console.log('Registering user:', userData)
      const response = await api.post('/auth/register', userData)
      console.log('Register response:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message)
      throw error
    }
  },

  login: async (credentials) => {
    try {
      console.log('Logging in user:', credentials.email)
      const response = await api.post('/auth/login', credentials)
      console.log('Login response:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      throw error
    }
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}

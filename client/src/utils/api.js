import axios from 'axios'

// Dynamically determine API URL
// In development we prefer using a relative '/api' so Vite's proxy (configured in
// client/vite.config.js) forwards requests to the backend. This avoids CORS and
// handles situations where the backend auto-selected a different port.
const API_URL = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || '/api') : (import.meta.env.VITE_API_URL || '/api')

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout (increase to reduce client-side aborts during slow AI responses)
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server might be down')
    } else if (error.message === 'Network Error') {
      console.error('⚠ Network error - check if backend is running')
      console.error('Current API URL:', API_URL)
      console.error('Expected backend ports: 5000, 5001, 5002')
    }
    return Promise.reject(error)
  }
)

// Test API connection on load
setTimeout(() => {
  api.get('/health')
    .then(() => {
      console.log('✓ Connected to API:', API_URL)
    })
    .catch((error) => {
      console.warn('⚠ Cannot connect to API:', API_URL)
      console.warn('Make sure backend server is running')
      console.warn('Run: cd server && npm run dev')
    })
}, 1000)

export default api

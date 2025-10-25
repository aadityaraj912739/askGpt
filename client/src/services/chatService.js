import api from '../utils/api'

export const chatService = {
  sendMessage: async (message) => {
    const response = await api.post('/chat/message', { message })
    return response.data
  },

  getConversations: async () => {
    const response = await api.get('/chat/conversations')
    return response.data
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`)
    return response.data
  },

  createConversation: async () => {
    const response = await api.post('/chat/conversations')
    return response.data
  },
}

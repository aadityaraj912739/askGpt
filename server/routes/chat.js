import express from 'express'
import { sendMessage, getConversations, getMessages, createConversation } from '../controllers/chatController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect) // All chat routes require authentication

router.post('/message', sendMessage)
router.get('/conversations', getConversations)
router.post('/conversations', createConversation)
router.get('/conversations/:id/messages', getMessages)

export default router

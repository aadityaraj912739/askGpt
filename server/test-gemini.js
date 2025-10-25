import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

console.log('Testing Gemini API...')
console.log('API Key:', process.env.GOOGLE_GEMINI_API_KEY ? 'Present' : 'Missing')

const testGemini = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' })
    
    console.log('Sending test message...')
    const result = await model.generateContent('Say "Hello, World!" in a friendly way.')
    const response = await result.response
    const text = response.text()
    
    console.log('✓ Success! Response:', text)
    process.exit(0)
  } catch (error) {
    console.error('✗ Error:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

testGemini()

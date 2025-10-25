import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

console.log('Testing MongoDB Connection...')
console.log('MongoDB URI:', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully!')
    console.log('Host:', mongoose.connection.host)
    console.log('Database:', mongoose.connection.name)
    process.exit(0)
  })
  .catch((error) => {
    console.error('✗ MongoDB connection failed:', error.message)
    process.exit(1)
  })

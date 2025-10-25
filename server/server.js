import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables first
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET']
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars)
  process.exit(1)
}

// Debug: Check if API key is loaded
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  GEMINI_KEY_EXISTS: !!process.env.GOOGLE_GEMINI_API_KEY,
  GEMINI_KEY_PREFIX: process.env.GOOGLE_GEMINI_API_KEY?.substring(0, 10) || 'NOT FOUND'
})

const app = express()

// Function to find available port
const findAvailablePort = async (startPort) => {
  const net = await import('net')
  const portNum = parseInt(startPort)
  
  return new Promise((resolve) => {
    const server = net.createServer()
    
    server.listen(portNum, () => {
      const port = server.address().port
      server.close(() => resolve(port))
    })
    
    server.on('error', () => {
      // Port is busy, try next one
      resolve(findAvailablePort(portNum + 1))
    })
  })
}

// Start server with automatic port detection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()

    // Middleware
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:5175', 
      'http://localhost:5176'
    ];

    app.use(cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow all localhost origins
        if (/^http:\/\/localhost:\d+$/.test(origin)) {
          return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true
    }));
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // Add logging middleware for debugging
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`, req.body)
      next()
    })

    // Routes
    app.use('/api/auth', authRoutes)
    app.use('/api/chat', chatRoutes)

    // Test route
    app.post('/api/test', (req, res) => {
      console.log('Test route hit:', req.body)
      res.json({ message: 'Test successful', received: req.body })
    })

    // Health check
    app.get('/api/health', (req, res) => {
      const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
      res.json({
        status: 'OK',
        message: 'Server is running',
        database: dbStatus,
        mongodb: mongoose.connection.host || 'Not connected'
      })
    })

    // Error handling middleware
    app.use((err, req, res, next) => {
      err.statusCode = err.statusCode || 500;
      err.status = err.status || 'error';

      if (process.env.NODE_ENV === 'development') {
        console.error('ERROR 💥', err);
      } else {
        // In production, log essential error info
        console.error('ERROR 💥', { 
          statusCode: err.statusCode,
          status: err.status,
          message: err.message 
        });
      }

      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err)
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err)
      process.exit(1)
    })

    const PORT = parseInt(process.env.PORT) || 5000
    const availablePort = await findAvailablePort(PORT)
    
    app.listen(availablePort, () => {
      console.log(`\n✓ Server running on port ${availablePort}`)
      if (availablePort !== PORT) {
        console.log(`⚠ Port ${PORT} was in use, switched to port ${availablePort}`)
        console.log(`→ Update your client VITE_API_URL to: http://localhost:${availablePort}/api`)
      }
  console.log(`→ API available at: http://localhost:${availablePort}/api`)
      console.log(`→ Health check: http://localhost:${availablePort}/api/health\n`)

      // Write the selected port to a file so external scripts can pick it up
      try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const portFile = path.join(__dirname, '.port')
        fs.writeFileSync(portFile, String(availablePort), { encoding: 'utf8' })
        console.log(`→ Wrote port to: ${portFile}`)
      } catch (err) {
        console.warn('Could not write port file:', err.message)
      }
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

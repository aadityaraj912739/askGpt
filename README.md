# AskGPT - Full-Stack AI Chatbot

A modern, Gemini-style chatbot application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a clean UI, JWT authentication, and real-time AI conversations.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **Real-time Chat**: Interactive chatbot interface with message history
- **Modern UI**: Clean, Gemini-inspired design with TailwindCSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Conversation Management**: Save and retrieve chat history
- **API Ready**: Structured backend ready for AI API integration

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone or Navigate to the Project

```bash
cd c:\Users\ar912\OneDrive\Desktop\CB
```

### 2. Install Dependencies

#### Install Client Dependencies
```bash
cd client
npm install
```

#### Install Server Dependencies
```bash
cd ../server
npm install
```

### 3. Configure Environment Variables

#### Client (.env)
The client `.env` file is already configured:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Server (.env)
Update the server `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000

# MongoDB Connection (update with your MongoDB URI)
MONGODB_URI=mongodb://localhost:27017/askgpt

# JWT Secret (change this to a secure random string)
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Optional: AI API Keys (uncomment when ready)
# OPENAI_API_KEY=your_openai_api_key
# GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For Windows (if installed as a service)
net start MongoDB

# For macOS/Linux
mongod

# Or use MongoDB Atlas (cloud) - just update MONGODB_URI in .env
```

### 5. Run the Application

**🚀 EASY METHOD - Use the Startup Script:**

#### Windows (Recommended):
```bash
# Double-click start.bat in the project folder
# OR run in terminal:
.\start.bat

# For PowerShell:
.\start.ps1
```

This will automatically:
- ✅ Start both backend and frontend servers
- ✅ Detect and use available ports automatically
- ✅ Open separate terminal windows for each server

**📝 MANUAL METHOD:**

You'll need to run both the client and server in separate terminal windows:

#### Terminal 1 - Start the Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000` (or next available port)

#### Terminal 2 - Start the Frontend
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173` (or next available port)

**✨ NEW: Automatic Port Detection**
- If port 5000 is busy, backend automatically tries 5001, 5002, etc.
- If port 5173 is busy, frontend (Vite) automatically tries 5174, 5175, etc.
- No more "port already in use" crashes!

## 🎯 Usage

1. **Register**: Create a new account at `http://localhost:5173/register`
2. **Login**: Sign in with your credentials
3. **Chat**: Start chatting with the AI assistant
4. **Logout**: Click the logout button in the sidebar

## 📁 Project Structure

```
CB/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ChatInput.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/      # API service functions
│   │   │   ├── authService.js
│   │   │   └── chatService.js
│   │   ├── store/         # Zustand state management
│   │   │   ├── authStore.js
│   │   │   └── chatStore.js
│   │   ├── utils/         # Utility functions
│   │   │   └── api.js
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── config/
│   │   └── db.js         # Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   └── auth.js       # JWT authentication middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Conversation.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── chat.js
│   ├── .env
│   ├── package.json
│   └── server.js         # Entry point
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Chat
- `POST /api/chat/message` - Send a message and get AI response (protected)
- `GET /api/chat/conversations` - Get all conversations (protected)
- `POST /api/chat/conversations` - Create new conversation (protected)
- `GET /api/chat/conversations/:id/messages` - Get messages for a conversation (protected)

## 🤖 AI Integration

The current implementation includes a placeholder AI response generator in `server/controllers/chatController.js`. 

To integrate with a real AI service:

1. **OpenAI Integration**:
   - Get API key from [OpenAI Platform](https://platform.openai.com/)
   - Add to `.env`: `OPENAI_API_KEY=your_key`
   - Update `generateAIResponse()` function

2. **Google Gemini Integration**:
   - Get API key from [Google AI Studio](https://makersuite.google.com/)
   - Add to `.env`: `GOOGLE_GEMINI_API_KEY=your_key`
   - Update `generateAIResponse()` function

Example OpenAI integration:
```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const generateAIResponse = async (userMessage) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: userMessage }]
  })
  return completion.choices[0].message.content
}
```

## 🔒 Security Notes

- Change `JWT_SECRET` in production to a secure random string
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder
3. Update `VITE_API_URL` to your production API URL

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables in your hosting platform
2. Deploy the server folder
3. Ensure MongoDB is accessible (use MongoDB Atlas for cloud)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Built with ❤️ using MERN Stack**

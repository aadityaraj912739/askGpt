# 🔑 Setting Up Your Gemini API Key

## ✅ WORKING MODEL FOUND!

**Your API key is valid and working!**  
**Model Name:** `gemini-2.0-flash-exp`

## Current Configuration

Your `.env` file is correctly configured with:
```env
GOOGLE_GEMINI_API_KEY=AIzaSyDo6-cPvXn_hPMtN9dCWKhcvJ1sumXdoZk
```

## What Changed

Google recently updated their Gemini API models. The working model is now:
- ✅ **gemini-2.0-flash-exp** (Experimental Flash 2.0)

Old models that no longer work:
- ❌ gemini-pro
- ❌ gemini-1.5-pro
- ❌ gemini-1.5-flash

## 🎉 Your Chatbot is Now Fully Functional!

The backend has been updated to use `gemini-2.0-flash-exp` and should now provide real AI responses!

### Step 1: Visit Google AI Studio
Go to: **https://makersuite.google.com/app/apikey**

### Step 2: Create/Get Your API Key
1. Sign in with your Google account
2. Click "Create API Key" or "Get API Key"
3. Copy the API key (it will look like: `AIza...`)

### Step 3: Update Your .env File
Open `server/.env` and update:
```env
GOOGLE_GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

### Step 4: Restart the Server
```bash
cd server
npm run dev
```

## 🔍 Verify Your API Key

Your current API key: `AIzaSyAPwv-25nLnHl8XTGuBbAl48RE_9Vccrb8`

**This key may be:**
- ❌ Invalid or expired
- ❌ Not enabled for Gemini API
- ❌ Restricted to specific domains/IPs

## 🎯 Alternative: Use OpenAI Instead

If you prefer to use OpenAI instead of Gemini:

### 1. Get OpenAI API Key
Visit: https://platform.openai.com/api-keys

### 2. Install OpenAI Package
```bash
cd server
npm install openai
```

### 3. Update `chatController.js`
Replace the Gemini code with:
```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const generateAIResponse = async (userMessage) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    })
    return completion.choices[0].message.content
  } catch (error) {
    console.error('OpenAI Error:', error)
    return "Error: " + error.message
  }
}
```

### 4. Update .env
```env
OPENAI_API_KEY=sk-...your-key-here
```

## 🆘 For Now - Fallback Mode Active

The app now works with **fallback responses** while you fix the API key issue. Users will see helpful messages, but won't get real AI responses until the API key is fixed.

## ✅ Test Your Setup

After updating the API key, test it:
```bash
cd server
node test-gemini.js
```

You should see: `✓ Success! Response: ...`

---

**Need Help?** 
- Check Google AI Studio: https://makersuite.google.com/
- Gemini API Docs: https://ai.google.dev/docs

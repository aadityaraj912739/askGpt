import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

console.log('Checking availability of', process.env.GEMINI_MODEL || 'gemini-1.5-flash', 'model...');

const listModels = async () => {
  const modelsToTry = [process.env.GEMINI_MODEL || 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];
  
  for (const modelName of modelsToTry) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
      
      console.log(`\nTrying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello');
      const response = await result.response;
      console.log(`✓ ${modelName} works!`);
      console.log(`Response: ${response.text().substring(0, 50)}...`);
      return; // Stop at first working model
    } catch (error) {
      console.error(`✗ ${modelName} failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ No working models found. Please check your API key.');
};

listModels();
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Gemini API Key with gemini-2.5-flash...');
console.log('API Key:', process.env.GOOGLE_GEMINI_API_KEY ? 'Present' : 'Missing');

const testFlashModel = async () => {
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    
    console.log(`\nTesting: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    const text = response.text();
    
    console.log(`✓ SUCCESS! ${modelName} works!`);
    console.log(`Response: ${text}`);
    console.log(`\n==> The recommended model ${modelName} is working.`);
    process.exit(0);
  } catch (error) {
    console.log(`✗ ${modelName} failed: ${error.message}`);
    console.log('\n❌ The model did not work. The API key might be invalid or not enabled for this model.');
    process.exit(1);
  }
};

testFlashModel();
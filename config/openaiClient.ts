// Import node module
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// OpenAI 클라이언트 생성
export const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

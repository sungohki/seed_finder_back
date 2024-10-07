// config/openaiClient.js
const { OpenAI } = require('openai');
require('dotenv').config(); // .env에서 API 키를 가져오기 위해 사용

// OpenAI 클라이언트 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;

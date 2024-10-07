// Import node module
import dotenv from 'dotenv';
const fs = require('fs').promises;

dotenv.config();

// Import local module
import { openAi } from '../common';

export const generateMessage = async (num: number, param: string) => {
  try {
    const data = await fs.readFile('./data/guidelines.json', 'utf8');
    const guidelines = JSON.parse(data);
    const messageContent = guidelines[num];
    if (!messageContent) {
      throw new Error(`info: ${num})에 맞는 항목이 없습니다.`);
    }
    const response = await openAi.chat.completions.create({
      messages: [
        { role: 'system', content: messageContent },
        { role: 'user', content: param },
      ],
      model: process.env.FINE_TUNING_MODEL as string,
    });
    return response.choices[0].message.content as string;
  } catch (e) {
    console.error(e);
  }
};

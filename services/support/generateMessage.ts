const openai=require('./config/openaiClient')
const dotenv=require('dotenv')
const fs = require('fs').promises;

dotenv.config()

export async function generateMessage(num:number, param:string) {
  console.log('generating~')
  try {
      const data = await fs.readFile('./data/guidelines.json', 'utf8');  
      const guidelines = JSON.parse(data); 
      const messageContent = guidelines[num];
      if (!messageContent) {
          throw new Error(`해당 번호(${num})에 맞는 항목이 없습니다.`);
      }
      const response = await openai.chat.completions.create({
        messages:  [{ role: "system", content: messageContent
       }, { role: "user", content: param}],
        model: process.env.FINE_TUNING_MODEL
      });
      return response.choices[0].content as string;
  } catch (error) {
      console.error("Error:", error);
  }
}


// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';

dotenv.config();

// Import local module
import { accessTokenVerify } from '../common';
import { documentInsert } from './documentInsert';
import { openAi } from '../../config/openaiClient';
import { ChatCompletionMessageParam } from 'openai/resources';

export const documentCreateOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { message } = req.body as { message: string };

  try {
    res.status(StatusCodes.OK).end();
    const data: Array<String | undefined> = [];

    for (let index = 1; index < 33; index++) {
      // for (let index = 1; index < 3; index++) {
      const ret = await generateMessage(index, message);
      data.push(ret);
    }

    await documentInsert(decodedUserAccount.id, message, data);

    // TODO: Add FCM function
    
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export const generateMessage = async (num: number, param: string) => {
  try {
    const messages:Array<ChatCompletionMessageParam>=[]

    const history=await readFile('./data/training_data.jsonl','utf-8');
    const lines=history.split('\n').filter(line => line.trim() !== '');
    if (num >= lines.length) {
      throw new Error(`info: ${num})에 맞는 항목이 없습니다.`);
    }
    const parsedLine = JSON.parse(lines[num]);
    const parsedLineContent = parsedLine.content.split(',');
    parsedLineContent.forEach((content: ChatCompletionMessageParam) => {
      messages.push(content); 
    });

    const data = await readFile('./data/guidelines.json', 'utf8');
    const guidelines = JSON.parse(data);
    const messageContent = guidelines[num];
    if (!messageContent)
      throw new Error(`info: ${num})에 맞는 항목이 없습니다.`);
    
    messages.push( { role: 'system', content: messageContent })
    messages.push({ role: 'user', content: param })


    const response = await openAi.chat.completions.create({
      messages: messages,
      model: process.env.FINE_TUNING_MODEL as string,
    });
    return response.choices[0].message.content as string;
  } catch (e) {
    console.error(e);
  }
};

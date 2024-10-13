// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { readFile } from 'fs/promises';
import mariadb from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Import local module
import { connInfo } from '../../config/mariadb';
import { accessTokenVerify, convertKeysToCamelCase } from '../common';
import { documentInsert } from './documentInsert';
import { openAi } from '../../config/openaiClient';
import { sendFCM } from '../common/fcm';

import { ChatCompletionMessageParam } from 'openai/resources';

import { IDocumentRequest, IGuide } from '.';

export const documentCreateOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const DR = req.body as IDocumentRequest;
  const conn = await mariadb.createConnection(connInfo);
  const sql = `
    SELECT *
    FROM Guide
    WHERE document_topic_id = (SELECT id FROM Document_Topic WHERE numbering_id = ?);
  `;
  let values = [DR.numberingId];

  try {
    let [results] = await conn.query(sql, values);
    res.status(StatusCodes.OK).end();
    const openAiAnswer: Array<String | undefined> = [];
    const temp: Array<IGuide> = [];
    for (const item of results as Array<IGuide>)
      temp.push(convertKeysToCamelCase(item));

    for (const item of temp) {
      const ret = await generateMessage(item.id, DR.message);
      openAiAnswer.push(ret);
    }
    await documentInsert(decodedUserAccount.id, DR, temp[0].id, openAiAnswer);

    // // test device token
    // const testToken = `
    //   ek4vgM6bSAmhM5rItu39Mf:APA91bEGIAqTKwdrXoi8hWu9BW0fzkNXq3JvAHeESfGdvecufuSobw0QZG1-CulylrTxnIH0LDMXWBXsBWjPkNijY1X1g29apf0nDvwHeAP_XRgjGl7qClxYlW7jOolGkNv6AaMF0pzS
    // `;
    // sendFCM(testToken);

    // console.log(DR.deviceToken);
    // if (DR.deviceToken)
    //  sendFCM(DR.deviceToken);
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export const generateMessage = async (num: number, param: string) => {
  try {
    const messages: Array<ChatCompletionMessageParam> = [];

    const history = await readFile('./data/training_data.jsonl', 'utf-8');
    const lines = history.split('\n').filter((line) => line.trim() !== '');
    if (num >= lines.length) {
      throw new Error(`info: ${num})에 맞는 항목이 없습니다.`);
    }
    const parsedLine = JSON.parse(lines[num]);
    const parsedLineContent = parsedLine.messages.forEach(
      (a: ChatCompletionMessageParam) => {
        messages.push(a);
      }
    );

    const data = await readFile('./data/guidelines.json', 'utf8');
    const guidelines = JSON.parse(data);
    const messageContent = guidelines[num];
    if (!messageContent)
      throw new Error(`info: ${num})에 맞는 항목이 없습니다.`);

    messages.push({
      role: 'system',
      content: messageContent + `200 자 이내로 작성해줘.`,
    });
    messages.push({ role: 'user', content: param + `200 자 이내로 작성해줘.` });

    const response = await openAi.chat.completions.create({
      messages: messages,
      model: process.env.FINE_TUNING_MODEL as string,
    });
    return response.choices[0].message.content as string;
  } catch (e) {
    console.error(e);
  }
};

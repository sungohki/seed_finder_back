// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { readFile } from 'fs/promises';
import mariadb from 'mysql2/promise';
import { ChatCompletionMessageParam } from 'openai/resources';

// Import local module
import { connInfo } from '../../config/mariadb';
import {
  sendFCM,
  accessTokenVerify,
  convertKeysToCamelCase,
  IMessageRequest,
} from '../common';
import { documentInsert } from './documentInsert';
import { openAi } from '../../config/openaiClient';
import { IDocumentRequest, IDocumentGuide } from '.';

export const documentCreateOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const doucmentRequest = req.body as IDocumentRequest;
  const conn = await mariadb.createConnection(connInfo);
  const sql = `
    SELECT *
    FROM Guide
    WHERE document_topic_id = 
    (SELECT id FROM Document_Topic WHERE numbering_id = ?);
  `;
  let values = [doucmentRequest.numberingId];

  try {
    let [results] = await conn.query(sql, values);
    res.status(StatusCodes.OK).end();
    const openAiAnswer: Array<String | undefined> = [];
    const temp: Array<IDocumentGuide> = [];
    for (const item of results as Array<IDocumentGuide>)
      temp.push(convertKeysToCamelCase(item));

    for (const item of temp) {
      const ret = await generateMessage(item.id, doucmentRequest.message);
      openAiAnswer.push(ret);
    }
    await documentInsert(
      decodedUserAccount.id,
      doucmentRequest,
      temp[0].id,
      openAiAnswer
    );

    // test device token
    // const testToken =
    //   'ek4vgM6bSAmhM5rItu39Mf:APA91bEGIAqTKwdrXoi8hWu9BW0fzkNXq3JvAHeESfGdvecufuSobw0QZG1-CulylrTxnIH0LDMXWBXsBWjPkNijY1X1g29apf0nDvwHeAP_XRgjGl7qClxYlW7jOolGkNv6AaMF0pzS';
    const testToken =
      'fIY1yA8nRN6iLi8GDfos5h:APA91bHG2LlehZGIC1TK0yLAzAmwE0CW5EtGAxeJR9WBQaKuoyEQwXu4UUEWsrdjgzXtKFnd19ZCvSC-xd15lN8jOVIaeEEaHjGLzskNlizgnR54ejvTpiBmiRPW3PeNYf6G5foDn3RJ';

    console.log(doucmentRequest);
    if (doucmentRequest.deviceToken) {
      const messageRequest: IMessageRequest = {
        title: doucmentRequest.title,
        body: doucmentRequest.message,
        data: {
          documentId: doucmentRequest.numberingId,
        },
        deviceToken: testToken,
      };
      // deviceToken: doucmentRequest.deviceToken,
      sendFCM(messageRequest);
    }
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  } finally {
    await conn.end();
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

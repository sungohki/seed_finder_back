// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { readFile } from 'fs/promises';
import mariadb, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Import local module
import { connInfo } from '../../config/mariadb';
import { accessTokenVerify, convertKeysToCamelCase } from '../common';
import { documentInsert } from './documentInsert';
import { openAi } from '../../config/openaiClient';
import { IGuide } from '.';

export const documentCreateOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { title, message, numberingId } = req.body as {
    title: string;
    message: string;
    numberingId: string;
  };
  const conn = await mariadb.createConnection(connInfo);
  const sql = `
    SELECT *
    FROM Guide
    WHERE document_topic_id = (SELECT id FROM Document_Topic WHERE numbering_id = ?);
  `;
  let values = [numberingId];

  try {
    let [results] = await conn.query(sql, values);
    res.status(StatusCodes.OK).end();
    const openAiAnswer: Array<String | undefined> = [];
    const temp: Array<IGuide> = [];
    for (const item of results as Array<IGuide>)
      temp.push(convertKeysToCamelCase(item));

    for (const item of temp) {
      const ret = await generateMessage(item.id, message);
      openAiAnswer.push(ret);
    }

    await documentInsert(
      decodedUserAccount.id,
      message,
      title,
      temp[0].id,
      openAiAnswer
    );
    // TODO: Add FCM function
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

export const generateMessage = async (num: number, param: string) => {
  try {
    const data = await readFile('./data/guidelines.json', 'utf8');
    const guidelines = JSON.parse(data);
    const messageContent = guidelines[num];
    if (!messageContent)
      throw new Error(`info: ${num})에 맞는 항목이 없습니다.`);

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

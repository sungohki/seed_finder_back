// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { readFile } from 'fs/promises';
import mariadb, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Import local module
import { connInfo } from '../../config/mariadb';
import { accessTokenVerify } from '../common';
import { documentInsert } from './documentInsert';
import { openAi } from '../../config/openaiClient';

export const documentCreateOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { message, numberingId } = req.body as {
    message: string;
    numberingId: string;
  };
  const conn = await mariadb.createConnection(connInfo);
  const sql = `
    SELECT COUNT(*)
    FROM Guide
    WHERE numbering_id = 
    (SELECT numbering_id FROM Document_Topic WHERE numbering_id = ?);
  `;
  let values = [numberingId];

  try {
    let [results] = await conn.query(sql, values);
    console.log(results);
    res.status(StatusCodes.OK).end();
    const data: Array<String | undefined> = [];

    for (let index = 1; index < 33; index++) {
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

// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { createRes, accessTokenVerify, queryErrorChecker } from '../common';
import { ResultSetHeader } from 'mysql2';
import { documentCreate } from './documentCreate';
import { generateMessage } from './generateMessage';

export const supportSendData = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;

  try {
    //TODO: 엑세스 토큰 로직 필요()
    const { message } = req.body;
    //TODO: message길이 오류 처리 필요
    res.status(StatusCodes.OK).end();

    //chat gpt api
    const data: Array<String | undefined> = await generateMessageAll(message);
    console.log('메시지 생성 완료');
    //database 저장
    await documentCreate(decodedUserAccount.id, message, data);

    //TODO: push alarm module()
  } catch (e) {
    console.error(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

async function generateMessageAll(message: string) {
  const data: Array<String | undefined> = [];
  for (let i = 1; i < 3; i++) {
    const ret = await generateMessage(i, message);
    data.push(ret);
  }
  return data;
}

// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { accessTokenVerify } from '../common';
import { documentCreate } from './documentCreate';
import { generateMessage } from './documentGenerateMessage';

export const documentSendData = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { message } = req.body;

  try {
    //TODO: message길이 오류 처리 필요
    res.status(StatusCodes.OK).end();
    const data: Array<String | undefined> = await generateMessageAll(message);
    await documentCreate(decodedUserAccount.id, message, data);

    //TODO: push alarm module()
  } catch (e) {
    console.error(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

const generateMessageAll = async (message: string) => {
  const data: Array<String | undefined> = [];
  for (let index = 1; index < 33; index++) {
    // for (let index = 1; index < 3; index++) {
    const ret = await generateMessage(index, message);
    data.push(ret);
  }
  return data;
};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const userJoin = (req: Request, res: Response) => {
  res.write('회원 가입 요청');
  return res.status(StatusCodes.OK).end();
};

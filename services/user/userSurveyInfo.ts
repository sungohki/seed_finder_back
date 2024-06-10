import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const userSurveyInfo = (req: Request, res: Response) => {
  res.write('회원 정보 추가 요청');
  return res.status(StatusCodes.OK).end();
};

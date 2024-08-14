import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../common';

export const userSurveyInfo = (req: Request, res: Response) => {
  // res.write('회원 정보 추가 요청');
  const decodedInfo = verifyAccessToken(req, res);

  return res.status(StatusCodes.OK).json({
    ...decodedInfo,
  });

  // return res.status(StatusCodes.OK).end();
};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const businessDetail = (req: Request, res: Response) => {
  res.write('지원 사업 자세히 보기');
  return res.status(StatusCodes.OK).end();
};

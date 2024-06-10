import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const businessPreviews = (req: Request, res: Response) => {
  res.write('지원 사업 리스트 조회');
  return res.status(StatusCodes.OK).end();
};

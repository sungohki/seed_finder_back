import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const userLogin = (req: Request, res: Response) => {
  res.write('로그인 요청');
  return res.status(StatusCodes.OK).end();
};

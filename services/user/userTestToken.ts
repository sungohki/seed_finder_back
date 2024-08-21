// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

// import local module
import { refreshAccessToken, verifyAccessToken } from '../common';

export const userTestToken = (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json(verifyAccessToken(req, res));
  //   return res.status(StatusCodes.OK).json(refreshAccessToken(req, res));
};

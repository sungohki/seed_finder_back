// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

// Import local module
import { accessTokenRefresh, accessTokenVerify } from '../common';

export const userTestToken = (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json(accessTokenVerify(req, res));
};

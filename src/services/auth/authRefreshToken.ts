// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { tokenRefresh } from '../common';

export const authRefreshToken = (req: Request, res: Response) => {
  return tokenRefresh(req, res);
};

import { Request, Response } from 'express';
import * as TS from '../services/test';

export const testSendFCMHander = (req: Request, res: Response) => {
  return TS.testSendFCM(req, res);
};

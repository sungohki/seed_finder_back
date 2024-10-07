import { Request, Response } from 'express';
import * as ss from '../services/support';

export const documentCreateHandler = (req: Request, res: Response) => {
  return ss.supportSendData(req, res);
};

export const documentGetResultHandler = (req: Request, res: Response) => {
  return ss.getDocContent(req, res);
};

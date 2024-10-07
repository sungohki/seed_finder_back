import { Request, Response } from 'express';
import * as ss from '../services/support';

export const documentCreateHandler = (req: Request, res: Response) => {
  return ss.documentSendData(req, res);
};

export const documentGetResultHandler = (req: Request, res: Response) => {
  return ss.documentGetOne(req, res);
};

export const documentMessageUpdateHandler = (req: Request, res: Response) => {
  return ss.documentUpdate(req, res);
};

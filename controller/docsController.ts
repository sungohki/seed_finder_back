import { Request, Response } from 'express';
import * as ds from '../services/docs';

export const documentGetAllHandler = (req: Request, res: Response) => {
  return ds.documentGetAll(req, res);
};

export const documentCreateHandler = (req: Request, res: Response) => {
  return ds.documentCreateOne(req, res);
};

export const documentGetOneHandler = (req: Request, res: Response) => {
  return ds.documentGetOne(req, res);
};

export const documentMessageUpdateHandler = (req: Request, res: Response) => {
  return ds.documentUpdate(req, res);
};

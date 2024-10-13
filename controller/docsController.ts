import { Request, Response } from 'express';
import * as DS from '../services/docs';

export const documentGetAllHandler = (req: Request, res: Response) => {
  return DS.documentGetAll(req, res);
};

export const documentCreateHandler = (req: Request, res: Response) => {
  return DS.documentCreateOne(req, res);
};

export const documentGetOneHandler = (req: Request, res: Response) => {
  return DS.documentGetOne(req, res);
};

export const documentMessageUpdateHandler = (req: Request, res: Response) => {
  return DS.documentUpdate(req, res);
};

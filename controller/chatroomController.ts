import { Request, Response } from 'express';
import * as CRS from '../services/chatroom';

export const chatroomGetAllHandler = (req: Request, res: Response) => {
  return CRS.chatroomGetAll(req, res);
};

export const chatroomGetOneHandler = (req: Request, res: Response) => {
  return CRS.chatroomGetOne(req, res);
};

export const chatroomCreateOneHandler = (req: Request, res: Response) => {
  return CRS.chatroomCreateOne(req, res);
};

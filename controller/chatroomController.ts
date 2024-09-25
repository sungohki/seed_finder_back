import { Request, Response } from 'express';
import * as crs from '../services/chatroom';

export const chatroomGetAllHandler = (req: Request, res: Response) => {
  return crs.chatroomGetAll(req, res);
};

export const chatroomGetOneHandler = (req: Request, res: Response) => {
  return crs.chatroomGetOne(req, res);
};

export const chatroomCreateOneHandler = (req: Request, res: Response) => {
  return crs.chatroomCreateOne(req, res);
};

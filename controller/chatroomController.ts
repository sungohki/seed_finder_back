import { Request, Response } from 'express';
import * as cs from '../services/chatroom';

export const chatroomGetAllHandler = (req: Request, res: Response) => {
  return cs.chatroomGetAll(req, res);
};

export const chatroomGetOneHandler = (req: Request, res: Response) => {
  return cs.chatroomGetOne(req, res);
};

export const chatroomCheckmessageHandler = (req: Request, res: Response) => {
  return cs.chatroomCheckMessage(req, res);
};

export const chatroomCreateOneHandler = (req: Request, res: Response) => {
  return cs.chatroomCreateOne(req, res);
};

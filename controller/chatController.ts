import { Request, Response } from 'express';
import * as cs from '../services/chat';

export const chatSendMessageHandler = (req: Request, res: Response) => {
  return cs.chatSendMessage(req, res);
};

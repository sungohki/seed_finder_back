import { Request, Response } from 'express';
import * as CS from '../services/chat';

export const chatSendMessageHandler = (req: Request, res: Response) => {
  return CS.chatSendMessage(req, res);
};

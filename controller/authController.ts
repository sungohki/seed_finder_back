import { Request, Response } from 'express';
import * as AS from '../services/auth';

export const authKaKaoLoginHandler = (req: Request, res: Response) => {
  return AS.authKakaoLogin(req, res);
};

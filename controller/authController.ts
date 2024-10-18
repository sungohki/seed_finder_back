import { Request, Response } from 'express';
import * as AS from '../services/auth';

export const authKaKaoLoginHandler = (req: Request, res: Response) => {
  return AS.authKakaoLogin(req, res);
};

export const authGoogleLoginHandler = (req: Request, res: Response) => {
  return AS.authGoogleLogin(req, res);
};

export const authRefreshTokenHandler = (req: Request, res: Response) => {
  return AS.authRefreshToken(req, res);
};

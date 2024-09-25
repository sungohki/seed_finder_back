import { Request, Response } from 'express';
import * as us from '../services/user';

export const userLoginHandler = (req: Request, res: Response) => {
  return us.userLogin(req, res);
};
export const userJoinHandler = (req: Request, res: Response) => {
  return us.userJoin(req, res);
};
export const userSurveyInfoHandler = (req: Request, res: Response) => {
  return us.userSurveyInfo(req, res);
};
export const userSurveyOptionHandler = (req: Request, res: Response) => {
  return us.userSurveyOption(req, res);
};
export const userTestTokenHandler = (req: Request, res: Response) => {
  return us.userTestToken(req, res);
};

export const userSurveyCheckHandler = (req: Request, res: Response) => {
  return us.userSurveyCheck(req, res);
};

import { Request, Response } from 'express';
import * as userService from '../services/user';

export const userLoginHandler = (req: Request, res: Response) => {
  return userService.userLogin(req, res);
};
export const userJoinHandler = (req: Request, res: Response) => {
  return userService.userJoin(req, res);
};
export const userSurveyInfoHandler = (req: Request, res: Response) => {
  return userService.userSurveyInfo(req, res);
};
export const userSurveyOptionHandler = (req: Request, res: Response) => {
  return userService.userSurveyOption(req, res);
};
export const userTestTokenHandler = (req: Request, res: Response) => {
  return userService.userTestToken(req, res);
};

export const userSurveyCheckHandler = (req: Request, res: Response) => {
  return userService.userSurveyOption(req, res);
};
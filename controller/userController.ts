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
export const userUpdateInfoHandler = (req: Request, res: Response) => {
  return userService.userUpdateInfo(req, res);
};

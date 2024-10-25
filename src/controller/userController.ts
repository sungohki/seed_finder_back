import { Request, Response } from 'express';
import * as US from '../services/user';

// export const userLoginHandler = (req: Request, res: Response) => {
//   return US.userLogin(req, res);
// };
// export const userJoinHandler = (req: Request, res: Response) => {
//   return US.userJoin(req, res);
// };
export const userDeleteHandler = (req: Request, res: Response) => {
  return US.userDelete(req, res);
};
export const userSurveyInfoHandler = (req: Request, res: Response) => {
  return US.userSurveyInfo(req, res);
};
export const userSurveyOptionHandler = (req: Request, res: Response) => {
  return US.userSurveyOption(req, res);
};
export const userSurveyCheckHandler = (req: Request, res: Response) => {
  return US.userSurveyCheck(req, res);
};

import { Request, Response } from 'express';
import * as likeService from '../services/like';

export const LikeAddHandler = (req: Request, res: Response) => {
  return likeService.likeAdd(req, res);
};

export const LikeDeleteHandler = (req: Request, res: Response) => {
  return likeService.likeDelete(req, res);
};

export const LikePersonalListHandler = (req: Request, res: Response) => {
  return likeService.likePersonalList(req, res);
};

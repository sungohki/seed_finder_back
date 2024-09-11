import { Request, Response } from 'express';
import * as favoriteService from '../services/favorite';

export const FavoriteAddHandler = (req: Request, res: Response) => {
  return favoriteService.favoriteAdd(req, res);
};

export const FavoriteDeleteHandler = (req: Request, res: Response) => {
  return favoriteService.favoriteDelete(req, res);
};

export const FavoritePersonalListHandler = (req: Request, res: Response) => {
  return favoriteService.favoritePersonalList(req, res);
};

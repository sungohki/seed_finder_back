import { Request, Response } from 'express';
import * as fs from '../services/favorite';

export const FavoriteAddHandler = (req: Request, res: Response) => {
  return fs.favoriteAdd(req, res);
};

export const FavoriteDeleteHandler = (req: Request, res: Response) => {
  return fs.favoriteDelete(req, res);
};

export const FavoritePersonalListHandler = (req: Request, res: Response) => {
  return fs.favoritePersonalList(req, res);
};

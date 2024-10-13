import { Request, Response } from 'express';
import * as FS from '../services/favorite';

export const FavoriteAddHandler = (req: Request, res: Response) => {
  return FS.favoriteAdd(req, res);
};

export const FavoriteDeleteHandler = (req: Request, res: Response) => {
  return FS.favoriteDelete(req, res);
};

export const FavoritePersonalListHandler = (req: Request, res: Response) => {
  return FS.favoritePersonalList(req, res);
};

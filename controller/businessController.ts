import { Request, Response } from 'express';
import * as bs from '../services/business';

export const businessGetAllHandler = (req: Request, res: Response) => {
  return bs.businessGetAll(req, res);
};

export const businessGetPartialHandler = (req: Request, res: Response) => {
  return bs.businessGetPartial(req, res);
};

export const businessGetDetailHandler = (req: Request, res: Response) => {
  return bs.businessGetDetail(req, res);
};

import { Request, Response } from 'express';
import * as BS from '../services/business';

export const businessGetAllHandler = (req: Request, res: Response) => {
  return BS.businessGetAll(req, res);
};

export const businessGetPartialHandler = (req: Request, res: Response) => {
  return BS.businessGetPartial(req, res);
};

export const businessGetDetailHandler = (req: Request, res: Response) => {
  return BS.businessGetDetail(req, res);
};

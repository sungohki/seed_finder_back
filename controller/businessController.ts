import { Request, Response } from 'express';
import * as businessService from '../services/business';

export const businessGetAllHandler = (req: Request, res: Response) => {
  return businessService.businessGetAll(req, res);
};

export const businessGetPartialHandler = (req: Request, res: Response) => {
  return businessService.businessGetPartial(req, res);
};

export const businessGetDetailHandler = (req: Request, res: Response) => {
  return businessService.businessGetDetail(req, res);
};

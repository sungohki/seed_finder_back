import { Request, Response } from 'express';
import * as businessService from '../services/business';

export const businessPreviewsHandler = (req: Request, res: Response) => {
  return businessService.businessPreviews(req, res);
};

export const businessDetailHandler = (req: Request, res: Response) => {
  return businessService.businessDetail(req, res);
};

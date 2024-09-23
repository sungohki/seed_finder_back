import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QueryError } from 'mysql2';

export const queryErrorChecker = (err: QueryError | null, res: Response) => {
  if (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: err,
    });
  } else return null;
};

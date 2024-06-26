import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QueryError, ResultSetHeader } from 'mysql2';

export function readRes(
  res: Response,
  err: QueryError,
  results: ResultSetHeader
) {
  if (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  return res.status(StatusCodes.OK).json(results);
}

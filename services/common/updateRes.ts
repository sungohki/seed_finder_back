import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QueryError, ResultSetHeader } from 'mysql2';

export function updateRes(
  res: Response,
  err: QueryError,
  results: ResultSetHeader
) {
  if (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
  if (results.affectedRows) {
    return res.status(StatusCodes.OK).json(results);
  } else {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}

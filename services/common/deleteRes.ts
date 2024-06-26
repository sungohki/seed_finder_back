import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { QueryError, ResultSetHeader } from 'mysql2';

export function deleteRes(
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

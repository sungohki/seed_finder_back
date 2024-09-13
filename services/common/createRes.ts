import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { QueryError, ResultSetHeader } from 'mysql2';

export function createRes(
  res: Response,
  err: QueryError | null,
  results: ResultSetHeader
) {
  if (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).json({
      ...err,
    });
  }
  if (results.affectedRows) {
    console.log(results);
    return res.status(StatusCodes.CREATED).json({
      affectedRows: results.affectedRows,
    });
  } else {
    return res.status(StatusCodes.NO_CONTENT).json({
      affectedRows: results.affectedRows,
    });
  }
}

// Import node module
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { QueryError, ResultSetHeader } from 'mysql2';

export const queryErrorChecker = (err: QueryError | null, res: Response) => {
  if (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: err,
    }); // 400
  } else return null;
};

export const createRes = (
  res: Response,
  err: QueryError | null,
  results: ResultSetHeader
) => {
  if (queryErrorChecker(err, res)) return;

  if (results.affectedRows) {
    console.log({
      insertId: results.insertId,
      affectedRows: results.affectedRows,
    });
    return res.status(StatusCodes.CREATED).json({
      affectedRows: results.affectedRows,
    }); // 201
  } else {
    console.log({
      affectedRows: results.affectedRows,
    });
    return res.status(StatusCodes.NO_CONTENT).json({
      affectedRows: results.affectedRows,
    }); // 204
  }
};

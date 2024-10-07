// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { accessTokenVerify, queryErrorChecker } from '../common';

export const documenntGetAll = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const sql = `
    SELECT
        *
    FROM
      Document
    WHERE
      user_id = ?
  `;
  const values = [decodedUserAccount.id];
  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return;
    return res.status(StatusCodes.OK).json(results);
  });
};

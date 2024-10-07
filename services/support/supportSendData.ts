// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { createRes, accessTokenVerify, queryErrorChecker } from '../common';
import { ResultSetHeader } from 'mysql2';

export const supportSendData = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { content } = req.body;
  const sql = `
    insert into
        document
  `;
  let values: Array<string> = [content];

  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return;
  });
};

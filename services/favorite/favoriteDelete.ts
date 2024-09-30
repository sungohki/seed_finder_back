// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { createRes, accessTokenVerify } from '../common';
import { ResultSetHeader } from 'mysql2';

export const favoriteDelete = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { businessId } = req.params;
  const sql = `
    DELETE FROM 
        User_Favorite_Business 
    WHERE
        user_id = ? AND announcement_id = ?
  `;
  const values: Array<number> = [decodedUserAccount.id, parseInt(businessId)];

  conn.query<ResultSetHeader>(sql, values, (err, results) => {
    createRes(res, err, results);
  });
};

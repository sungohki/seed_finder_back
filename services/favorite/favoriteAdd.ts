// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../config/mariadb';
import { accessTokenVerify } from '../common/accessTokenVerify';
import { createRes } from '../common';
import { ResultSetHeader } from 'mysql2';

export const favoriteAdd = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { businessId } = req.params;
  const sql = `
    INSERT INTO
      User_Favorite_Business
        (user_id, announcement_id)
      VALUES
        (?, ?)
  `;
  const values: Array<number> = [
    decodedUserAccount.id,
    parseInt(businessId, 10),
  ];

  conn.query<ResultSetHeader>(sql, values, (err, results) => {
    console.log(
      `info: [ ${businessId} ] added on Favorite (user_id : ${decodedUserAccount.id})`
    );
    return createRes(res, err, results);
  });
};

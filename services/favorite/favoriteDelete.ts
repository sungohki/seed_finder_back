// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { createRes, verifyAccessToken } from '../common';
import { ResultSetHeader } from 'mysql2';

export const favoriteDelete = (req: Request, res: Response) => {
  // TODO) 로그인 토큰 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  const { businessId } = req.params;
  const sql = `
    DELETE FROM 
        User_Favorite_Business 
    WHERE
        user_id = ? AND announcement_id = ?
  `;
  const values: Array<number> = [decodedUserAccount.id, parseInt(businessId)];

  try {
    conn.query<ResultSetHeader>(sql, values, (err, results) => {
      createRes(res, err, results);
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: e,
    });
  }
};

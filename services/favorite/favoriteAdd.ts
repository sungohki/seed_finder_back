// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { verifyAccessToken } from '../common/verifyAccessToken';
import { createRes } from '../common';
import { ResultSetHeader } from 'mysql2';

export const favoriteAdd = (req: Request, res: Response) => {
  // TODO) 로그인 토큰 확인
  const decodedUserAccount = verifyAccessToken(req, res);
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

  try {
    conn.query<ResultSetHeader>(sql, values, (err, results) => {
      return createRes(res, err, results);
    });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: e,
    });
  }
};

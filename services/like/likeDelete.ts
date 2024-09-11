// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { createRes, verifyAccessToken } from '../common';
import { ResultSetHeader } from 'mysql2';

export const likeDelete = (req: Request, res: Response) => {
  // TODO) 로그인 토큰 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  const { business_id } = req.params;
  const sql = `
    DELETE FROM 
        User_Favorite_Business 
    WHERE
        user_id = ? AND announcement_id = ?
  `;
  const values: Array<number> = [decodedUserAccount.id, parseInt(business_id)];

  try {
    conn.query<ResultSetHeader>(sql, values, (err, results) => {
      createRes(res, err, results);
    });
  } catch (e) {
    return res.status(StatusCodes.OK).json({
      req: '위시리스트 항목 삭제',
      res: e,
    });
  }
};

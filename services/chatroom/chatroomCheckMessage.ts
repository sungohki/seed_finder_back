// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { queryErrorChecker, verifyAccessToken } from '../common';

export const chatroomCheckMessage = (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  // chatroomId 가져오기
  const { chatroomId } = req.params;
  const sql = `
    UPDATE
      ChatLog
    SET
      last_checked_log_id = 
        (SELECT  id 
        FROM ChatLog 
        WHERE user_id = ? AND chatroom_id = ? 
        ORDER BY created_at DESC)
    WHERE 
      user_id = ? AND chatroom_id = ?
  `;
  const values = [
    decodedUserAccount.id,
    chatroomId,
    decodedUserAccount.id,
    chatroomId,
  ];

  try {
    conn.query(sql, values, (err, results) => {
      queryErrorChecker(err, res);
      return res.status(StatusCodes.OK).json(results);
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: e,
    });
  }
};

// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { createRes, queryErrorChecker, verifyAccessToken } from '../common';
import { ResultSetHeader } from 'mysql2';

export const chatroomSendMessage = (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  // chatroomId 가져오기
  const { chatroomId } = req.params;
  const { senderRole, content } = req.body;
  const sql = `
    INsert into
        ChatLog
        (sender_role, content, user_id, chatroom_id)
    values
        (?, ?, ?, ?)
  `;
  const values = [
    senderRole,
    content,
    decodedUserAccount.id,
    parseInt(chatroomId),
  ];

  try {
    conn.query<ResultSetHeader>(sql, values, (err, results) => {
      return createRes(res, err, results);
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: e,
    });
  }
};

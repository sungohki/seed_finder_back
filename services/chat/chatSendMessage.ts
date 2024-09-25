// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { createRes, verifyAccessToken } from '../common';
import { ResultSetHeader } from 'mysql2';

export const chatSendMessage = (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  // chatroomId 가져오기
  const { chatroomId } = req.params;
  const { content } = req.body;
  const sql = `
    INsert into
        ChatLog
        (sender_role, content, user_id, chatroom_id)
    values
        (?, ?, ?, ?)
  `;
  let values: Array<number | string>;
  if (decodedUserAccount.userRole)
    values = ['MANAGER', content, decodedUserAccount.id, parseInt(chatroomId)];
  else
    values = ['CUSTOMER', content, decodedUserAccount.id, parseInt(chatroomId)];

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
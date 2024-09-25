// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { queryErrorChecker, verifyAccessToken } from '../common';

export interface IChatLog {
  id: number;
  senderRole: string;
  // senderRole: 'CUSTOMER' | 'MANAGER';
  content: string | null;
  createdAt: string;
  chatroomId: number;
}

export const chatroomGetOne = (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  // chatroomId 가져오기
  const { chatroomId } = req.params;
  const sql = `
    SELECT
      id,
      sender_role as senderRole,
      content,
      created_at as createAt
    FROM
      ChatLog
    WHERE
      user_id = ? AND chatroom_id = ?
  `;
  const values = [decodedUserAccount.id, parseInt(chatroomId)];
  let resValue: IChatLog[];

  try {
    conn.query(sql, values, (err, results) => {
      queryErrorChecker(err, res);
      resValue = Object.values(results) as Array<IChatLog>;
      return res.status(StatusCodes.OK).json(resValue);
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: e,
    });
  }
};

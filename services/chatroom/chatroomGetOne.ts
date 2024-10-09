// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../config/mariadb';
import { queryErrorChecker, accessTokenVerify } from '../common';

export interface IChatLog {
  id: number;
  senderRole: string; // 'CUSTOMER' | 'MANAGER';
  content: string | null;
  createdAt: string;
  chatroomId: number;
}

export const chatroomGetOne = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
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

  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return;

    return res
      .status(StatusCodes.OK)
      .json(Object.values(results) as Array<IChatLog>);
  });
};

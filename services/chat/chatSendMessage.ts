// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../config/mariadb';
import { createRes, accessTokenVerify } from '../common';
import { ResultSetHeader } from 'mysql2';

export const chatSendMessage = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { chatroomId } = req.params;
  const { content } = req.body;
  const sql = `
    INSERT INTO
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

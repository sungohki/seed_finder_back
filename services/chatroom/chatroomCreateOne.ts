// Import node module
import { Request, Response } from 'express';

// Import local module
import { connection as conn } from '../../mariadb';
import { createRes, accessTokenVerify } from '../common';
import { IChatroom } from '.';
import { ResultSetHeader } from 'mysql2';

export const chatroomCreateOne = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { numberingId } = req.body as IChatroom;

  // User-Chatroom 관계 생성
  const sql = `
      INSERT INTO
        User_ChatRoom
        (user_id, chatroom_id)
      VALUES
        (?, (SELECT id FROM ChatRoom WHERE numbering_id = ? LIMIT 1))
    `;
  const values = [decodedUserAccount.id, numberingId];
  conn.query<ResultSetHeader>(sql, values, (err, results) => {
    return createRes(res, err, results);
  });
};

// Import node module
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { queryErrorChecker } from '../common';

export const chatroomCheckMessage = (
  res: Response,
  userId: number,
  chatroomId: number
) => {
  const sql = `
    UPDATE
      User_Chatroom
    SET
      last_checked = NOW()
    WHERE 
      user_id = ? AND chatroom_id = ?
  `;
  const values = [userId, chatroomId];

  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return false;
    console.log(results);
  });
  return true;
};

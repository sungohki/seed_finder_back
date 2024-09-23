// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { createRes, verifyAccessToken } from '../common';
import { IChatroom } from './chatroomGetAll';
import { ResultSetHeader } from 'mysql2';

export const chatroomCreateOne = async (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  // DB 연결
  const { numberingId } = req.body as IChatroom;

  try {
    // User-Chatroom 관계 생성
    const sql = `
      INSERT INTO
        User_Chatroom
        (user_id, chatroom_id)
      VALUES
        (?, (SELECT id FROM ChatRoom WHERE numbering_id = ?))
    `;
    const values = [decodedUserAccount.id, numberingId];
    conn.query<ResultSetHeader>(sql, values, (err, results) => {
      return createRes(res, err, results);
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: e,
    });
  }
};

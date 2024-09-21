// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connInfo } from '../../mariadb';
import mariadb, { ResultSetHeader } from 'mysql2/promise';
import { verifyAccessToken } from '../common';
import { IChatroom } from './chatroomGetAll';

export const chatroomCreateOne = async (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  // DB 연결
  const conn = await mariadb.createConnection(connInfo);
  const { numberingId } = req.body as IChatroom;

  // 1. chatroom 엔티티 생성
  let sql = `
    INSERT INTO
      chatroom
      (numberingId)
    VALUES
        (?)
  `;
  let values = [numberingId];
  let [results] = await conn.query(sql, values);
  console.log(results);

  // 2. User-Chatroom 관계 생성
  sql = `
    Insert into
      User_Chatroom
      (user_id, chatroom_id)
    values
      (?, ?)
  `;
  const newChatRoom = results as ResultSetHeader;
  values = [decodedUserAccount.id, newChatRoom.insertId];
  [results] = await conn.query(sql, values);
  console.log(results);

  try {
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: e,
    });
  }
};

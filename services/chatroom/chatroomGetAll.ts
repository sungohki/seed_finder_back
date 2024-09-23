// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';
import { convertKeysToCamelCase, verifyAccessToken } from '../common';

export interface IChatroom {
  chatroomId: number;
  numberingId: number;
}

export interface IChatroomPreview extends IChatroom {
  lastMessage: string | null;
  lastMessageCreatedAt: string | null;
  unreadMessageCount: number | null;
}

export const chatroomGetAll = (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;
  const sql = `
    SELECT 
      CR.id AS chatroomId,
      CR.numbering_id AS numberingId,
      C.content AS lastMessage,
      C.createdAt AS lasstMessageCreatedAt
    FROM 
      ChatRoom CR
    JOIN 
      User_ChatRoom UC
      ON CR.id = UC.chatroom_id
    JOIN 
      Chat C
      ON CR.id = C.chatroom_id
    WHERE 
      UC.user_id = ?
    AND 
      C.createdAt = (
        SELECT MAX(C2.createdAt)
        FROM Chat C2
        WHERE C2.chatroom_id = CR.id
      )
  `;
  const values = [decodedUserAccount.id];
  let resValue: Array<IChatroomPreview>;

  try {
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: err,
        });
      }
      resValue = Object.values(results) as Array<IChatroomPreview>;
      for (let item of resValue) convertKeysToCamelCase(item);
      return res.status(StatusCodes.OK).json(resValue);
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: e,
    });
  }
};

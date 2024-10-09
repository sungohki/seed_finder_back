// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../config/mariadb';
import {
  convertKeysToCamelCase,
  accessTokenVerify,
  queryErrorChecker,
} from '../common';
import { IChatroomPreview } from '.';

export const chatroomGetAll = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const sql = `
    SELECT 
      CR.id AS chatroomId,
      CR.numbering_id AS numberingId,
      CR.title as title,
      CL.content AS lastMessage,
      CL.created_at AS lastMessageCreatedAt,
      COUNT(CL3.id) AS unreadMessageCount
    FROM 
      ChatRoom CR
    JOIN 
      User_ChatRoom UC ON CR.id = UC.chatroom_id
    LEFT JOIN 
      ChatLog CL ON CR.id = CL.chatroom_id
      AND CL.created_at = (
          SELECT MAX(CL2.created_at)
          FROM ChatLog CL2 
          WHERE CL2.chatroom_id = CR.id
      )
    LEFT JOIN 
      ChatLog CL3 ON CR.id = CL3.chatroom_id
      AND CL3.created_at > UC.last_checked
    WHERE 
      UC.user_id = ?
    GROUP BY 
      CR.id, CR.numbering_id, CL.content, CL.created_at;
  `;
  const values = [decodedUserAccount.id];
  let resValue: Array<IChatroomPreview>;

  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return;
    resValue = Object.values(results) as Array<IChatroomPreview>;
    for (let item of resValue) convertKeysToCamelCase(item);
    return res.status(StatusCodes.OK).json(resValue);
  });
};

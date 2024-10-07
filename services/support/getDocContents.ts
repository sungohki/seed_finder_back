import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { connection as conn } from '../../mariadb';
import { createRes, accessTokenVerify, queryErrorChecker } from '../common';
import { ResultSetHeader } from 'mysql2';

export const getDocContent= (req: Request, res: Response) => {
    const decodedUserAccount = accessTokenVerify(req, res);
    if (decodedUserAccount === null) return;
    const userId=decodedUserAccount.id
    const sql = `
    SELECT
      M.guide_id,
      M.message_content
    FROM
      Document D
    JOIN
      Message M
    ON
      D.id = M.document_id
    WHERE
      D.user_id = ?
  `;
  conn.query(sql,userId, (err, results) => {
    if (queryErrorChecker(err, res)) return;
    return res.status(StatusCodes.OK).json({
        messages: results  // results 배열을 "messages"라는 키로 리턴
      });
  });
};
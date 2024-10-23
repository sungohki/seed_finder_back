// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { accessTokenVerify, queryErrorChecker } from '../common';

export const documentGetOne = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { documentId } = req.params;
  const sql = `
    SELECT
      G.guide_title as guideTitle,
      M.message_content as messageContent
    FROM
      Document D
    JOIN
      Message M
      ON D.id = M.document_id
    JOIN
      Guide G
      ON M.guide_id = G.id
    WHERE
      D.user_id = ? 
      AND D.id = ?;
  `;
  const values = [decodedUserAccount.id, parseInt(documentId)];
  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return;
    return res.status(StatusCodes.OK).json(results);
  });
};

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
      M.guide_id,
      M.message_content
    FROM
      Document D
    JOIN
      Message M
    ON
      D.id = M.document_id
    WHERE
      D.user_id = ? and D.id = ?
  `;
  const values = [decodedUserAccount.id, parseInt(documentId)];
  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return;
    return res.status(StatusCodes.OK).json(results);
  });
};

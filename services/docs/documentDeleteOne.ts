// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../config/mariadb';
import { accessTokenVerify, queryErrorChecker } from '../common';

export const documentDeleteOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const { documentId } = req.params;
  const sql = '';
  let values;

  try {
    conn.query(sql, (err, results) => {
      if (queryErrorChecker(err, res)) return;

      return res.status(StatusCodes.OK).json(results);
    });
  } catch (e) {
    console.error(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  }
};

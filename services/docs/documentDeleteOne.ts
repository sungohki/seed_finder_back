// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mariadb from 'mysql2/promise';

// Import local module
import { connInfo } from '../../config/mariadb';
import { accessTokenVerify, queryErrorChecker } from '../common';

export const documentDeleteOne = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const conn = await mariadb.createConnection(connInfo);
  const { documentId } = req.params;

  try {
    // 1. 문서 내 메시지 삭제
    let sql = `
      DELETE FROM Message
      WHERE document_id = ?
    `;
    let values = [documentId];
    let [results] = await conn.query(sql, values);

    // 2. 문서 삭제
    sql = `
      DELETE FROM Document 
      WHERE id = ?
    `;
    [results] = await conn.query(sql, values);
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
  } finally {
    await conn.end();
    return res.status(StatusCodes.OK).json({ message: 'Success delete' });
  }
};

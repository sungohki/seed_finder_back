// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { accessTokenVerify } from '../common';
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';

export const userDelete = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const conn = await mariadb.createConnection(connInfo);
  let sql, values, results;

  try {
    // 1. 사업계획서 정보 삭제
    sql = `
        DELETE FROM Message
        WHERE document_id in (
          SELECT id FROM Document WHERE user_id = ?
        )
    `;
    values = [decodedUserAccount.id];
    [results] = await conn.query(sql, values);
    sql = `
        DELETE FROM Document
        WHERE user_id= ?
    `;
    values = [decodedUserAccount.id];
    [results] = await conn.query(sql, values);
    console.log(results);

    // 2. 즐겨찾기 사업 삭제
    sql = `
        DELETE FROM 
        User_Favorite_Business 
        WHERE
        user_id = ?
    `;
    [results] = await conn.query(sql, values);
    console.log(results);

    // 3. 사용자 관계 테이블 정보 삭제
    sql = `DELETE FROM User_Business_Classification WHERE user_id = ?`;
    [results] = await conn.query(sql, values);
    sql = `DELETE FROM User_Application_Target WHERE user_id = ?`;
    [results] = await conn.query(sql, values);
    sql = `DELETE FROM User_Support_Region WHERE user_id = ?`;
    [results] = await conn.query(sql, values);

    // 4. 사용자 삭제
    sql = `DELETE FROM User WHERE id = ?`;
    [results] = await conn.query(sql, values);

    return res.status(StatusCodes.OK).json();
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.BAD_REQUEST).json(e);
  } finally {
    await conn.end;
  }
};

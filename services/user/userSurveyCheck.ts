// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { accessTokenVerify } from '../common';
import mariadb from 'mysql2/promise';
import { connInfo } from '../../config/mariadb';

export const userSurveyCheck = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const conn = await mariadb.createConnection(connInfo);
  const sql = `
    SELECT
      *
    FROM
      User_Business_Classification
    WHERE
      user_id = ?
  `;
  const values = [decodedUserAccount.id];
  try {
    let [results] = await conn.query(sql, values);

    if (Object.values(results).length === 0)
      return res.status(StatusCodes.OK).json({
        surveyStatus: false,
      });

    return res.status(StatusCodes.OK).json({
      surveyStatus: true,
    }); // 200
  } catch (e) {
    console.error(e);
    res.status(StatusCodes.BAD_REQUEST).json(e); // 400
  } finally {
    await conn.end();
  }
};

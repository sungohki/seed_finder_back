// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { accessTokenVerify } from '../common';
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';

//회원 설문 여부 확인
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
    console.log(results);

    // 결과가 없는 경우 설문을 하지 않은 상태로 처리
    if (Object.values(results).length === 0)
      return res.status(StatusCodes.OK).json({
        surveyStatus: false,
      });

    // 결과가 있는 경우 설문을 한 상태로 처리
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

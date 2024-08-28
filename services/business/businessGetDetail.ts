// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { ISurveyInfo } from '../user';
import { verifyAccessToken } from '../common';

export const businessGetDetail = async (req: Request, res: Response) => {
  const decodedUserInfo = verifyAccessToken(req, res);
  if (decodedUserInfo === null)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 토큰 인식 불가',
    });
  const conn = await mariadb.createConnection(connInfo);
  let userInfo = {} as ISurveyInfo;
  let sql, values, results;

  // 1. 지원사업분류 정보 저장
  sql = `
    SELECT
      business_classification_id
    FROM
      User_Business_Classification
    WHERE
      user_id = ?
  `;
  values = [decodedUserInfo.id];
  [results] = await conn.query(sql, values);
  console.log(results);
  userInfo.businessCategory = await Object.values(results);

  return res.status(StatusCodes.OK).json({
    request: '추천사업조회',
    response: results,
  });
};

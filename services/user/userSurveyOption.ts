// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { verifyAccessToken } from '../common';
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { ISurveyInfo } from './userSurveyInfo';

export const userSurveyOption = async (req: Request, res: Response) => {
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 토큰 인식 불가',
    });
  const conn = await mariadb.createConnection(connInfo);
  let resValue = {} as ISurveyInfo;
  let sql: string, results: mariadb.QueryResult;

  // 1. 지원사업분류
  sql = `
    SELECT * FROM Business_Classification
  `;
  [results] = await conn.query(sql);
  console.log('1.');
  console.log(results);

  // 2. 신청대상
  sql = `
    SELECT * FROM Application_Target
  `;
  [results] = await conn.query(sql);
  console.log('2.');
  console.log(results);

  // 3. 지역
  sql = `
    SELECT * FROM Support_Region
  `;
  [results] = await conn.query(sql);
  console.log('1.');
  console.log(results);

  return res.status(StatusCodes.OK).json({
    request: '설문 옵션 불러오기',
    response: '완료',
    // response: resValue,
  });
};

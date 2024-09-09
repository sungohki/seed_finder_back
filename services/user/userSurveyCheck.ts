// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { verifyAccessToken } from '../common';
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';

//회원 설문 여부 확인
export const userSurveyCheck= async (req: Request, res: Response)=>{
    // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;

  //db연결
  const conn = await mariadb.createConnection(connInfo);

  let sql, values, results;

  // 1. 지원사업분류 조회 (없으면 설문 안한 것)
  sql = `SELECT * FROM User_Business_Classification WHERE user_id = ?`;
  values = [decodedUserAccount.id];
  [results] = await conn.query(sql, values);
  console.log(results);

  // 결과가 없는 경우 설문을 하지 않은 상태로 처리
  if (Object.values(results).length === 0) {
    console.log('설문 안 함');
    return res.status(StatusCodes.OK).json({
      surveyStatus: false,
    });
  }

  // 결과가 있는 경우 설문을 한 상태로 처리
  console.log('설문 완료');
  return res.status(StatusCodes.OK).json({
    surveyStatus: true,
  });
  

}
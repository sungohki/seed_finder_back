import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../common';
// import { connection as conn } from '../../mariadb';
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';

interface ISurveyInfo {
  businessCategory: string;
  businessRegion: string;
  businessApply: string;
  businessExperience: string;
  businessTargetAge: number;
}

// 회원 정보 설문
export const userSurveyInfo = async (req: Request, res: Response) => {
  const decodedInfo = verifyAccessToken(req, res);
  if (decodedInfo === null) return;

  const conn = await mariadb.createConnection(connInfo);

  const {
    businessCategory,
    businessRegion,
    businessApply,
    businessExperience,
    businessTargetAge,
  } = req.body as ISurveyInfo;

  // 1. user 데이터 추가
  let sql = `
    INSERT INTO 
      user
      (support_business_classification_id, support_region_id)
    VALUES
      (?, ?)`;
  let values = [businessCategory, businessRegion];
  let [results] = await conn.query(sql, values);
  console.log(`1. ` + results);
  if (results) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 체크포인트1',
    });
  }

  // 2. 신청대상 테이블 데이터 추가
  sql = `INSERT INTO user (Application_Target) VALUES (?)`;
  values = [businessApply];
  [results] = await conn.query(sql, values);
  console.log(`2. ` + results);
  if (results) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 체크포인트2',
    });
  }

  // 3. 사업업력 테이블 데이터 추가
  sql = `INSERT INTO user (Business_Duration) VALUES (?)`;
  values = [businessExperience];
  [results] = await conn.query(sql, values);
  console.log(`3. ` + results);
  if (results) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 체크포인트3',
    });
  }

  // 4. 사업대상연령 테이블 데이터 추가
  sql = `INSERT INTO user (Target_Age_For_Business) VALUES (?)`;
  values = [String(businessTargetAge)];
  [results] = await conn.query(sql, values);
  console.log(`4. ` + results);
  if (results) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 체크포인트4',
    });
  }
  return res.status(StatusCodes.OK).json(results[0]);
};

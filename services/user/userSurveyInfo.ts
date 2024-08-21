import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../common';
// import { connection as conn } from '../../mariadb';
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';

export interface ISurveyInfo {
  businessCategory: Array<string>;
  businessRegion: Array<string>;
  businessApply: Array<string>;
  businessExperience: number;
  businessTargetAge: number;
}

// 회원 정보 설문
export const userSurveyInfo = async (req: Request, res: Response) => {
  const decodedUserInfo = verifyAccessToken(req, res);
  if (decodedUserInfo === null)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 토큰 인식 불가',
    });
  const conn = await mariadb.createConnection(connInfo);
  const {
    businessCategory,
    businessRegion,
    businessApply,
    businessExperience,
    businessTargetAge,
  } = req.body as ISurveyInfo;
  let sql, values, results;

  // 1. 지원사업분류
  for (let item in businessCategory) {
    sql = `
      INSERT INTO
        Business_Classification
          (user_id, support_business_classification_id)
        VALUE
          (?, (SELECT id FROM Support_Business_Classification WHERE name = ?))`;
    values = [decodedUserInfo.id, item];
    [results] = await conn.query(sql, values);
    console.log(`1. ` + results);
    if (results) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'info: 체크포인트1',
      });
    }
  }
  // 2. 신청대상
  for (let item in businessApply) {
    sql = `
      INSERT INTO
          Application_Target
          (user_id, application_target_id)
        VALUE
          (?, (SELECT id FROM Application_Target WHERE name = ?))`;
    values = [decodedUserInfo.id, item];
    [results] = await conn.query(sql, values);
    console.log(`2. ` + results);
    if (results) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'info: 체크포인트2',
      });
    }
  }
  // 3. 지역
  for (let item in businessRegion) {
    sql = `
      INSERT INTO
        Support_Region
          (user_id, support_region_id)
        VALUE
          (?, (SELECT id FROM Support_Region WHERE name = ?))`;
    values = [decodedUserInfo.id, item];
    [results] = await conn.query(sql, values);
    console.log(`3. ` + results);
    if (results) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'info: 체크포인트3',
      });
    }
  }
  // 4. 업력 & 예비창업자여부 & 연령
  sql = `
        INSERT INTO
          user
            (user_age, pre_business_status, business_duration)
          VALUE
            (?, ?, ?)`;
  if (businessExperience === 0) values = [businessTargetAge, true, null];
  else values = [businessTargetAge, false, businessExperience];
  [results] = await conn.query(sql, values);
  console.log(`4. ` + results);
  if (results) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 체크포인트4',
    });
  }

  return res.status(StatusCodes.OK).json(results);
};

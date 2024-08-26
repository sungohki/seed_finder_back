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
  sql = `
      SELECT * FROM User_Business_Classification WHERE user_id = ?
  `;
  values = [decodedUserInfo.id];
  [results] = await conn.query(sql, values);
  console.log(Object.values(results));
  if (Object.values(results).length)
	  return res.status(200).json({message: "info: 이미 저장되었습니다."});

  if (0) {
    // 전처리: 동일 데이터가 이미 존재하는 경우
    console.log('info: 동일 데이터가 존재합니다. (지원사업분류 데이터)');
  } else {
    for (let item of businessCategory) {
      sql = `
      INSERT INTO
        User_Business_Classification
          (user_id, business_classification_id)
        VALUE
          (?, (SELECT id FROM Business_Classification WHERE name = ?))`;
      values = [decodedUserInfo.id, item];
      [results] = await conn.query(sql, values);
      console.log(`1. 지원 사업 분류 정보 저장 완료`);
      console.log(results);
    }
  }

  // 2. 신청대상
  if (0) {
    // 전처리: 동일 데이터가 이미 존재하는 경우
    console.log('info: 동일 데이터가 존재합니다. (신청대상 데이터)');
  } else {
    for (let item of businessApply) {
      sql = `
      INSERT INTO
          User_Application_Target
          (user_id, application_target_id)
        VALUE
          (?, (SELECT id FROM Application_Target WHERE name = ?))`;
      values = [decodedUserInfo.id, item];
      [results] = await conn.query(sql, values);
      console.log(`2. 신청 대상 정보 저장 완료`);
      console.log(results);
    }
  }

  // 3. 지역
  if (0) {
    // 전처리: 동일 데이터가 이미 존재하는 경우
    console.log('info: 동일 데이터가 존재합니다. (지역 데이터)');
  } else {
    for (let item of businessRegion) {
      sql = `
      INSERT INTO
      User_Support_Region
      (user_id, support_region_id)
      VALUE
      (?, (SELECT id FROM Support_Region WHERE name = ?))`;
      values = [decodedUserInfo.id, item];
      [results] = await conn.query(sql, values);
      console.log(`3. 지역 정보 저장 완료`);
      console.log(results);
    }
  }

  // 4. 업력 & 예비창업자여부 & 연령
  sql = `
    UPDATE
      User
    SET
      user_age = ?, pre_business_status = ?, business_duration = ?
    WHERE
      id = ?`;
  if (businessExperience === 0)
    values = [businessTargetAge, true, null, decodedUserInfo.id];
  else
    values = [businessTargetAge, false, businessExperience, decodedUserInfo.id];
  [results] = await conn.query(sql, values);
  console.log(`4. 업력 & 예비창업자 여부 & 연령 정보 저장 완료`);
  console.log(results);

  return res.status(StatusCodes.OK).json(results);
};

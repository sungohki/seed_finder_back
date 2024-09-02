// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { ISurveyInfo, IUserAccount } from '../user';
import { getUserInfo, verifyAccessToken } from '../common';

export const businessGetPartial = async (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;

  // 1. 사용자 설문 정보 호출
  const userInfo = await getUserInfo(decodedUserAccount);
  // console.log(userInfo);

  // 2. DB 연결
  const conn = await mariadb.createConnection(connInfo);

  const testReq = req.body as {
    application_targets: Array<number>;
  };
  let sql: string;
  let values = [];
  let results;
  let resultsValues;

  sql = `SELECT * FROM Announcement A`;
  // 신청대상 여부 판별
  if (userInfo.businessApply.length)
    sql += ` JOIN Announcement_Application_Target AAT ON A.announcement_id = AAT.announcement_id`;
  // 나이 여부 판별
  if (userInfo.businessTargetAge)
    sql += ` JOIN Target_Age TA ON A.target_age_id = TA.id`;

  // where을 어떻게 추가할까?!
  sql += ` WHERE`;
  if (userInfo.businessCategory) {
    sql += ` A.business_classification_id = ?`;
    values.push(userInfo.businessApply);
  }
  if (userInfo.businessApply.length) {
    sql += ` AND AAT.application_target_id IN (?)`;
    values.push(userInfo.businessRegion);
  }
  if (userInfo.businessRegion.length) {
    sql += ` AND A.support_region_id IN (?)`;
    values.push(userInfo.businessRegion);
  }
  if (userInfo.businessTargetAge) {
    sql += ` AND TA.age_min <= ? AND TA.age_max > ?`;
    values.push(userInfo.businessTargetAge, userInfo.businessTargetAge);
  }
  if (userInfo.businessExperience) {
    // 예비 창업자 X
    sql += ` AND A.pre_business_status = ?`;
    values.push(true);
  } else {
    // 예비 창업자 O
    sql += ` AND A.business_duration_id = ?`;
    values.push(userInfo.businessExperience);
  }

  sql += ` ORDER BY A.id ASC`;

  [results] = await conn.query(sql, values);
  let appliaction_target_items: Array<number> = [];

  return res.status(StatusCodes.OK).json({
    // ...userInfo,
    ...appliaction_target_items,
  });

  // return res.status(StatusCodes.OK).json({
  //   request: '추천사업조회',
  // });
};

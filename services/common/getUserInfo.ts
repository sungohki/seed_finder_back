// import node module

// import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { ISurveyInfo } from '../user';
import { DecodedToken, verifyAccessToken } from '.';

// 회원 정보 가져오기
export const getUserInfo = async (
  userAccount: DecodedToken
): Promise<ISurveyInfo> => {
  const conn = await mariadb.createConnection(connInfo);
  let userInfo = {} as ISurveyInfo;
  let sql: string,
    values: Array<string | number> | null,
    results: mariadb.QueryResult | null;

  // 1. 지원사업분류 정보 저장
  sql = `
    SELECT
      business_classification_id
    FROM
      User_Business_Classification
    WHERE
      user_id = ?
  `;
  values = [userAccount.id];
  [results] = await conn.query(sql, values);
  console.log(results);
  userInfo.businessCategory = Object.values(results);

  // 2. 신청대상
  sql = `
    SELECT
      application_target_id
    FROM
      User_Application_Target
    WHERE
      user_id = ?
  `;
  [results] = await conn.query(sql, values);
  console.log(results);
  userInfo.businessApply = Object.values(results);

  // 3. 지역
  sql = `
    SELECT
      support_region_id
    FROM
      User_Support_Region
    WHERE
      user_id = ?
  `;
  [results] = await conn.query(sql, values);
  console.log(results);
  userInfo.businessRegion = Object.values(results);

  // 4. 업력 & 예비창업자여부 & 연령
  sql = `
    SELECT
      user_age, pre_business_status, business_duration
    FROM
      User
    WHERE
      user_id = ?
  `;
  [results] = await conn.query(sql, values);
  console.log(results);
  // userInfo.businessTargetAge = results;
  // userInfo.businessExperience = results;

  return userInfo;
};

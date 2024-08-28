// import node module

// import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { DecodedToken, verifyAccessToken } from '.';

interface IUserInfo {
  businessCategory: Array<number>;
  businessApply: Array<number>;
  businessRegion: Array<number>;
  businessExperience: number;
  businessTargetAge: number;
}

// 회원 정보 가져오기
export const getUserInfo = async (
  userAccount: DecodedToken
): Promise<IUserInfo> => {
  const conn = await mariadb.createConnection(connInfo);
  let userInfo = {} as IUserInfo;
  let sql: string,
    values: Array<string | number> | null,
    temp: Array<number>,
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
  temp = [];
  for (let item of results as Array<{ business_classification_id: number }>) {
    temp.push(item.business_classification_id);
  }
  userInfo.businessCategory = temp;

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
  temp = [];
  for (let item of results as Array<{ application_target_id: number }>) {
    temp.push(item.application_target_id);
  }
  userInfo.businessApply = temp;

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
  temp = [];
  for (let item of results as Array<{ support_region_id: number }>) {
    temp.push(item.support_region_id);
  }
  userInfo.businessRegion = temp;

  // 4. 업력 & 예비창업자여부 & 연령
  sql = `
    SELECT
      user_age, pre_business_status, business_duration
    FROM
      User
    WHERE
      id = ?
  `;
  [results] = await conn.query(sql, values);
  console.log(results);
  const remainInfo = results as Array<{
    user_age: number;
    pre_business_status: number;
    business_duration: number;
  }>;
  userInfo.businessTargetAge = remainInfo[0].user_age;
  if (remainInfo[0].pre_business_status) userInfo.businessExperience = 0;
  else userInfo.businessExperience = remainInfo[0].business_duration;
  console.log(userInfo);

  return userInfo;
};

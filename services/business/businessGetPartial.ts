// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { getUserInfo, verifyAccessToken } from '../common';
import { businessToCalender, IBusinessPreview } from './businessGetAll';

export const businessGetPartial = async (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;

  // 1. 사용자 설문 정보 호출
  const userInfo = await getUserInfo(decodedUserAccount);

  // 2. DB 연결
  const conn = await mariadb.createConnection(connInfo);

  let sql: string;
  let values: any[] = [];

  sql = `
    SELECT DISTINCT A.id, A.integrated_project_name, BC.name AS business_classification_name, A.start_date, A.end_date
      FROM Announcement A
    JOIN
      Business_Classification BC
      ON A.business_classification_id = BC.id
  `;
  // 신청대상 여부 판별
  if (userInfo.businessApply.length) {
    sql += ` JOIN Announcement_Application_Target AAT ON A.id = AAT.announcement_id`;
  }
  // 나이 여부 판별
  if (userInfo.businessTargetAge) {
    sql += ` JOIN Target_Age TA ON A.target_age_id = TA.id`;
  }

  // where 절 추가
  sql += ` WHERE`;

  if (userInfo.businessCategory.length > 0) {
    sql += ` A.business_classification_id IN (${userInfo.businessCategory
      .map(() => '?')
      .join(',')})`;
    values.push(...userInfo.businessCategory);
  }
  if (userInfo.businessApply.length > 0) {
    sql += ` AND AAT.application_target_id IN (${userInfo.businessApply
      .map(() => '?')
      .join(',')})`;
    values.push(...userInfo.businessApply);
  }
  if (userInfo.businessRegion.length > 0) {
    sql += ` AND A.support_region_id IN (${userInfo.businessRegion
      .map(() => '?')
      .join(',')})`;
    values.push(...userInfo.businessRegion);
  }

  if (userInfo.businessTargetAge) {
    sql += ` AND (TA.age_min IS NULL OR TA.age_min <= ?) 
              AND (TA.age_max IS NULL OR TA.age_max > ?)`;
    values.push(userInfo.businessTargetAge, userInfo.businessTargetAge);
  }

  if (userInfo.businessExperience) {
    sql += ` AND A.pre_business_status = ?`;
    values.push(true);
  } else {
    sql += ` AND A.business_duration >= ?`;
    values.push(userInfo.businessExperience);
  }

  sql += ` ORDER BY A.id ASC`;

  try {
    const [rows] = (await conn.query(sql, values)) as [any[], any];
    const businessPreviews: IBusinessPreview[] = (rows as any[]).map((row) => ({
      id: row.id,
      integrated_project_name: row.integrated_project_name,
      // business_classification_id: row.business_classification_id,
      business_classification_name: row.business_classification_name,
      start_date: row.start_date,
      end_date: row.end_date,
    }));

    const calendarData = businessToCalender(businessPreviews);

    return res.status(StatusCodes.OK).json(calendarData);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'An error occurred while processing your request.',
    });
  } finally {
    await conn.end();
  }
};

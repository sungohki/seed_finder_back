// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mariadb from 'mysql2/promise';

// Import local module
import { connInfo } from '../../config/mariadb';
import { accessTokenVerify } from '../common';
import { businessToCalender, IBusinessPreview } from '.';
import { userGetInfo } from '../user';

export const businessGetPartial = async (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const userInfo = await userGetInfo(decodedUserAccount);
  const conn = await mariadb.createConnection(connInfo);
  let sql = `
    SELECT DISTINCT A.id, A.integrated_project_name, BC.name AS business_classification_name, A.start_date, A.end_date
      FROM Announcement A
    JOIN
      Business_Classification BC
      ON A.business_classification_id = BC.id
  `;
  let values: any[] = [];

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
      business_classification_name: row.business_classification_name,
      start_date: row.start_date,
      end_date: row.end_date,
    }));

    const calendarData = businessToCalender(businessPreviews);

    return res.status(StatusCodes.OK).json(calendarData);
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.BAD_REQUEST).json(e);
  } finally {
    await conn.end();
  }
};

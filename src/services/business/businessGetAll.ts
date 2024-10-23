// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import { IBusinessPreview } from '.';
import { queryErrorChecker } from '../common';

export const businessToCalender = (businessData: Array<IBusinessPreview>) => {
  const businessCalenderMap = new Map<string, Array<IBusinessPreview>>();
  const businessCalenderJson = {} as {
    [date: string]: Array<IBusinessPreview>;
  };
  for (let item of businessData) {
    const startDates = businessCalenderMap.get(item.start_date);
    if (startDates === undefined)
      businessCalenderMap.set(item.start_date, [item]);
    else businessCalenderMap.set(item.start_date, [...startDates, item]);
  }
  businessCalenderMap.forEach((value, key) => {
    businessCalenderJson[key] = value;
  });
  return businessCalenderJson;
};

export const businessGetAll = (req: Request, res: Response) => {
  const sql = `
    SELECT
      A.id, 
      A.integrated_project_name, 
      BC.name AS business_classification_name,
      A.start_date, 
      A.end_date
    FROM
      Announcement A
    JOIN
      Business_Classification BC
      ON A.business_classification_id = BC.id;
  `;
  // 아이디 통합공고사업명 지원사업분류 공고접수일시(시작 종료)

  conn.query(sql, (err, results) => {
    if (queryErrorChecker(err, res)) return;
    return res.status(StatusCodes.OK).json({
      ...businessToCalender(Object.values(results) as Array<IBusinessPreview>),
    });
  });
};

// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';

export interface IBusinessPreview {
  id: number;
  integrated_project_name: string;
  business_classification_name: string;
  start_date: string;
  end_date: string;
}

export const businessToCalender = (businessData: Array<IBusinessPreview>) => {
  let businessCalenderMap = new Map<string, Array<IBusinessPreview>>();
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
  // console.log(businessCalenderJson);
  return businessCalenderJson;
};

export const businessGetAll = (req: Request, res: Response) => {
  let sql = `
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
  let values: number[] | undefined;

  try {
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: err,
        });
      }
      return res.status(StatusCodes.OK).json({
        ...businessToCalender(
          Object.values(results) as Array<IBusinessPreview>
        ),
      });
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: e,
    });
  }
};

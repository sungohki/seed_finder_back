// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';

interface IBusinessPreview {
  id: number;
  integrated_project_name: string;
  business_classification_id: number;
  start_date: string;
  end_date: string;
}

export const businessGetAll = (req: Request, res: Response) => {
  let sql = `
    SELECT
      id, integrated_project_name, business_classification_id, start_date, end_date
    FROM
      Announcement`;
  // 아이디 통합공고사업명 지원사업분류 공고접수일시(시작 종료)
  const temp = req.query as { page: string; limit: string };
  let resValue: Object<string:Array<IBusinessPreview>>;
  let values: number[] | undefined;

  console.log(temp);
  if (temp.limit) {
    sql += ` LIMIT ? OFFSET ?`;
    values = [parseInt(temp.limit, 10), parseInt(temp.page, 10) | 0];
  }

  try {
	  conn.query(sql, values, (err, results) => {
	    if (err) {
	      console.log(err);
	      return res.status(StatusCodes.BAD_REQUEST).end();
	    }
	    resValue = Object.values(results) as Array<IBusinessPreview>;
	    return res.status(StatusCodes.OK).json({
	      ...resValue,
	    });
  });
  } catch (e) {
	  return res.status(StatusCodes.NO_CONTENT).json({
	    request: '전체 사업 조회',
	    response: '데이터베이스 결과 수신 오류',
	  });
  }
};

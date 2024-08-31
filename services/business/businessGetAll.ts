// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';

export const businessGetAll = (req: Request, res: Response) => {
  let sql = `SELECT * FROM Announcement`;
  const temp = req.query as { page: string; limit: string };
  let resValue;
  let values;

  console.log(temp);
  if (temp.limit) {
    sql += ` LIMIT ? OFFSET ?`;
    values = [parseInt(temp.limit, 10), parseInt(temp.page, 10) | 0];
  }

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    resValue = results;
    return res.status(StatusCodes.OK).json({
      ...resValue,
    });
  });
  return res.status(StatusCodes.NO_CONTENT).json({
    request: '전체 사업 조회',
    response: '데이터베이스 결과 수신 오류',
  });
};

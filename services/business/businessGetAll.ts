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
  console.log(temp.limit);
  console.log(temp.page);

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
      request: '전체 사업 조회',
      response: resValue,
    });
  });
};

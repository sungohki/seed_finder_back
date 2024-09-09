// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connection as conn } from '../../mariadb';
import { ISurveyInfo } from '../user';
import { verifyAccessToken } from '../common';

export const businessGetDetail = async (req: Request, res: Response) => {
  const { businessId } = req.params;
  let sql, resValue;
  const values = [businessId];

  sql = `
    SELECT * FROM Announcment WHERE id = ?
  `;

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    resValue = Object(results);
    return res.status(StatusCodes.OK).json({
      ...resValue,
    });
  });

  return res.status(StatusCodes.NO_CONTENT).json({
    request: '사업 상세 조회',
    response: '데이터베이스 결과 수신 오류',
  });
};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../common';
import { connection as conn } from '../../mariadb';
import { QueryError } from 'mysql2';

interface ISurveyInfo {}

// 회원 정보 설문
export const userSurveyInfo = (req: Request, res: Response) => {
  const decodedInfo = verifyAccessToken(req, res);
  if (decodedInfo === null) return;

  const surveyInfo: ISurveyInfo = req.body;
  const sql = ``;
  const values = [surveyInfo];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  });

  return (
    decodedInfo &&
    res.status(StatusCodes.OK).json({
      ...decodedInfo,
    })
  );

  // return res.status(StatusCodes.OK).end();
};

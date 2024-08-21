import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../common';
// import { connection as conn } from '../../mariadb';
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { ISurveyInfo } from './userSurveyInfo';

// 회원 정보 설문
export const userUpdateInfo = async (req: Request, res: Response) => {
  const decodedUserInfo = verifyAccessToken(req, res);
  if (decodedUserInfo === null)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 토큰 인식 불가',
    });
  const conn = await mariadb.createConnection(connInfo);
  const {
    businessCategory,
    businessRegion,
    businessApply,
    businessExperience,
    businessTargetAge,
  } = req.body as ISurveyInfo;
  let sql, values, results;

  businessCategory &&
    (async () => {
      sql = `UPDATE tableName SET  WHERE`;
      values = [businessRegion];
      [results] = await conn.query(sql, values);
      console.log(`1. ` + results);
      if (results) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'info: 체크포인트1',
        });
      }
    })();
  businessRegion &&
    (() => {
      console.log();
    })();
  businessApply &&
    (() => {
      console.log();
    })();
  businessExperience &&
    (() => {
      console.log();
    })();
  businessTargetAge &&
    (() => {
      console.log();
    })();

  return res.status(StatusCodes.OK).end();
};

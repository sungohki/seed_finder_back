// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';

interface ISurveyOption {
  business_classification: Array<{ id: number; name: string }>;
  application_target: Array<{ id: number; name: string }>;
  support_region: Array<{ id: number; name: string }>;
}

export const userSurveyOption = async (req: Request, res: Response) => {
  const conn = await mariadb.createConnection(connInfo);
  let resValue = {} as ISurveyOption;
  let sql: string, results: mariadb.QueryResult;

  try {
    // 1. 지원사업분류
    sql = `SELECT * FROM Business_Classification`;
    [results] = await conn.query(sql);
    resValue.business_classification = results as Array<{
      id: number;
      name: string;
    }>;

    // 2. 신청대상
    sql = `SELECT * FROM Application_Target`;
    [results] = await conn.query(sql);
    resValue.application_target = results as Array<{
      id: number;
      name: string;
    }>;

    // 3. 지역
    sql = `SELECT * FROM Support_Region`;
    [results] = await conn.query(sql);
    resValue.support_region = results as Array<{
      id: number;
      name: string;
    }>;

    return res.status(StatusCodes.OK).json({
      resValue,
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: e,
    });
  }
};

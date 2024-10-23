// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';

interface ISurveyOption {
  business_classification: Array<{ id: number; name: string }>;
  application_target: Array<{ id: number; name: string }>;
  support_region: Array<{ id: number; name: string }>;
  target_age: Array<{ id: number; age_min: number; age_max: number }>;
}

export enum ESurveyOption {
  business_classification = '지원 사업 분류',
  application_target = '신청 대상',
  support_region = '지역',
  target_age = '나이',
  business_duration = '사업 업력',
}

export const userSurveyOption = async (req: Request, res: Response) => {
  const conn = await mariadb.createConnection(connInfo);
  const resValue = {} as ISurveyOption;
  let sql: string;

  try {
    // 1. 지원 사업 분류
    sql = `SELECT * FROM Business_Classification`;
    let [results] = await conn.query(sql);
    resValue.business_classification =
      results as ISurveyOption['business_classification'];

    // 2. 신청 대상
    sql = `SELECT * FROM Application_Target`;
    [results] = await conn.query(sql);
    resValue.application_target =
      results as ISurveyOption['application_target'];

    // 3. 지역
    sql = `SELECT * FROM Support_Region`;
    [results] = await conn.query(sql);
    resValue.support_region = results as ISurveyOption['support_region'];

    // 4. 나이
    sql = `select * from Target_Age`;
    [results] = await conn.query(sql);
    resValue.target_age = results as ISurveyOption['target_age'];

    return res.status(StatusCodes.OK).json({
      question: [
        questionPhrase(ESurveyOption.business_classification),
        questionPhrase(ESurveyOption.application_target),
        questionPhrase(ESurveyOption.support_region),
        questionPhrase(ESurveyOption.target_age),
        questionPhrase(ESurveyOption.business_duration),
      ],
      ...resValue,
    });
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.BAD_REQUEST).json(e);
  } finally {
    await conn.end();
  }
};

const questionPhrase = (surveyOption: string) => {
  return `${surveyOption} 항목을 선택해주세요.`;
};

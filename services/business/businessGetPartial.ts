// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { ISurveyInfo, IUserAccount } from '../user';
import { getUserInfo, verifyAccessToken } from '../common';

export const businessGetPartial = async (req: Request, res: Response) => {
  // 로그인 상태 확인
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null) return;

  // 1. 사용자 설문 정보 호출
  const userInfo = await getUserInfo(decodedUserAccount);
  console.log(userInfo);

  // 2. DB 연결
  // const conn = await mariadb.createConnection(connInfo);
  // let sql: string, values: Array<string | number> | null;
  // let resValue;

  return res.status(StatusCodes.OK).json({
    ...userInfo,
  });

  // return res.status(StatusCodes.OK).json({
  //   request: '추천사업조회',
  //   response: resValue,
  // });
};

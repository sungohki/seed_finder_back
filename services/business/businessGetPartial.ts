// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { ISurveyInfo, IUserAccount } from '../user';
import { getUserInfo, verifyAccessToken } from '../common';

export const businessGetPartial = async (req: Request, res: Response) => {
  const decodedUserAccount = verifyAccessToken(req, res);
  if (decodedUserAccount === null)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 토큰 인식 불가',
    });
  const userInfo = await getUserInfo(decodedUserAccount);
  // const conn = await mariadb.createConnection(connInfo);
  // let resValue;
  // let query: string, values: Array<string | number> | null;

  return res.status(StatusCodes.OK).json({
    userInfo,
  });

  // return res.status(StatusCodes.OK).json({
  //   request: '추천사업조회',
  //   response: resValue,
  // });
};

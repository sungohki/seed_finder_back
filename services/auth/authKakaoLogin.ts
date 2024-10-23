// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mariadb, { ResultSetHeader } from 'mysql2/promise';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Import local module
import { connInfo } from '../../config/mariadb';
import { IAuthUser, tokenGenerate } from '../common';
import { IKakaoUser } from '.';

export const authKakaoLogin = async (req: Request, res: Response) => {
  const { kakaoAccessToken } = req.body;
  const accessPrivateKey = process.env.ACCESS_PRIVATE_KEY;
  const refreshPrivateKey = process.env.REFRESH_PRIVATE_KEY;
  if (!accessPrivateKey || !refreshPrivateKey) {
    console.error('Info: PRIVATE_KEY가 환경변수로 지정되어있지 않음.');
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
  const conn = await mariadb.createConnection(connInfo);

  try {
    const apiRequestUrl = 'https://kapi.kakao.com/v2/user/me';
    const apiRequestHeader = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${kakaoAccessToken}`,
    };
    const apiResponse = await axios.get(apiRequestUrl, {
      headers: apiRequestHeader,
    });
    const kakaoUserInfo = apiResponse.data as IKakaoUser;

    let sql = `SELECT * FROM User WHERE user_uuid = ? LIMIT 1`;
    let values: Array<number | string> = [kakaoUserInfo.id];
    let [results] = await conn.query(sql, values);
    let loginUser = (results as Array<{ id: number }>)[0];

    if (!loginUser) {
      sql = `
        INSERT INTO 
        User 
          (user_uuid, user_name, user_sexuality_id, user_contact) 
        VALUES 
          (?, ?, ?, ?)`;
      values = [
        kakaoUserInfo.id,
        kakaoUserInfo.kakao_account.name,
        kakaoUserInfo.kakao_account.gender == 'male' ? 1 : 2,
        kakaoUserInfo.kakao_account.phone_number,
      ];
      [results] = await conn.query(sql, values);
      loginUser = { id: (results as ResultSetHeader).insertId };
      console.log(`info: new user create (uid: ${loginUser.id})`);
    }

    const tokenInfo: IAuthUser = {
      id: loginUser.id,
      uuid: kakaoUserInfo.id,
      userName: kakaoUserInfo.kakao_account.name,
    };
    const accessTokenOption: jwt.SignOptions = {
      expiresIn: '1m',
      issuer: 'sungohki',
    };
    const instanceAccessToken = tokenGenerate(
      tokenInfo,
      accessPrivateKey,
      accessTokenOption
    );
    const refreshTokenOption: jwt.SignOptions = {
      expiresIn: '1d',
      issuer: 'sungohki',
    };
    const instanceRefreshToken = tokenGenerate(
      tokenInfo,
      refreshPrivateKey,
      refreshTokenOption
    );
    console.log(instanceAccessToken);
    console.log(instanceRefreshToken);
    return res.status(StatusCodes.OK).json({
      uuid: kakaoUserInfo.id + '',
      accessToken: instanceAccessToken,
      refreshToken: instanceRefreshToken,
    });
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.UNAUTHORIZED).json(e);
  } finally {
    await conn.end();
  }
};

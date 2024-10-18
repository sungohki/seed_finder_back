// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as axios from 'axios';
import jwt from 'jsonwebtoken';
import mariadb, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Import local module
import { IAuthUser, accessTokenGenerate } from '../common';
import { connInfo } from '../../config/mariadb';
import { IKakaoUser } from '.';

const header = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  Authorization: 'Bearer ',
};

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
    // 1. 카카오 계정 불러오기
    const kakaoUserInfo = await getUserInfo(kakaoAccessToken);
    console.log(kakaoUserInfo);

    // 2. 해당 유저가 존재하는 지 확인
    let sql = `SELECT * FROM User WHERE user_uuid = ? LIMIT 1`;
    let values: Array<number | string> = [kakaoUserInfo.id];
    let [results] = await conn.query(sql, values);
    const loginUser = (results as Array<{ id: number }>)[0];
    console.log(loginUser);

    // 2-1. 없는 존재인 경우 회원 생성
    if (!loginUser.id) {
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
      loginUser.id = (results as ResultSetHeader).insertId;
    }

    // 3-1. jwt 액세스 토큰 발행
    const accessTokenInfo: IAuthUser = {
      id: loginUser.id,
      uuid: kakaoUserInfo.id,
      userName: kakaoUserInfo.kakao_account.name,
    };
    const accessTokenOption: jwt.SignOptions = {
      expiresIn: '1h',
      issuer: 'sungohki',
    };
    const instanceAccessToken = accessTokenGenerate(
      accessTokenInfo,
      accessPrivateKey,
      accessTokenOption
    );

    // 3-2. jwt 리프레시 토큰 발행
    const refreshTokenOption: jwt.SignOptions = {
      expiresIn: '1d',
      issuer: 'sungohki',
    };
    const instanceRefreshToken = accessTokenGenerate(
      accessTokenInfo,
      refreshPrivateKey,
      refreshTokenOption
    );

    return res.status(StatusCodes.OK).json({
      uuid: kakaoUserInfo.id + '',
      accessToken: instanceAccessToken,
      refreshToken: instanceRefreshToken,
    });
  } catch (e) {
    console.error(e);
    return res.status(StatusCodes.UNAUTHORIZED).json(e);
  }
};

const getUserInfo = async (accessToken: string) => {
  header.Authorization += accessToken;
  const requestUrl = 'https://kapi.kakao.com/v2/user/me';
  const userInfo = await axios.get(requestUrl, {
    headers: header,
  });
  const result = userInfo.data as IKakaoUser;
  return result;
};

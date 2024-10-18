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
import { IGoogleUser } from '.';

export const authGoogleLogin = async (req: Request, res: Response) => {
  const { googleAccessToken } = req.body;
  const accessPrivateKey = process.env.ACCESS_PRIVATE_KEY;
  const refreshPrivateKey = process.env.REFRESH_PRIVATE_KEY;
  if (!accessPrivateKey || !refreshPrivateKey) {
    console.error('Info: PRIVATE_KEY가 환경변수로 지정되어있지 않음.');
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
  const conn = await mariadb.createConnection(connInfo);

  if (!googleAccessToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Access token is required' });
  }

  try {
    // 1. 구글 계정 불러오기
    const apiRequestUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const apiRequestHeader = {
      Authorization: `Bearer ${googleAccessToken}`,
    };
    const apiResponse = await axios.get(apiRequestUrl, {
      headers: apiRequestHeader,
    });
    const googleUserInfo = apiResponse.data as IGoogleUser;

    // 2. 해당 유저 존재 확인
    let sql = `SELECT * FROM User WHERE user_uuid = ? LIMIT 1`;
    let values = [googleUserInfo.sub];
    let [results] = await conn.query(sql, values);
    let loginUser: { id: number } = (results as Array<{ id: number }>)[0];

    // 2-1. 없는 존재인 경우 회원 생성
    if (!loginUser) {
      sql = `
        INSERT INTO 
          User 
          (user_uuid, user_name, user_email) 
        VALUES 
          (?, ?, ?)`;
      values = [googleUserInfo.sub, googleUserInfo.name, googleUserInfo.email];
      [results] = await conn.query(sql, values);
      loginUser = { id: (results as ResultSetHeader).insertId };
      console.log(`info: new user create (uid: ${loginUser.id})`);
    }
    const tokenInfo: IAuthUser = {
      id: loginUser.id,
      uuid: googleUserInfo.sub,
      userName: googleUserInfo.name,
    };
    const accessTokenOption: jwt.SignOptions = {
      expiresIn: '1h',
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
      uuid: googleUserInfo.sub,
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

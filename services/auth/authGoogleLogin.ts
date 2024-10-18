// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mariadb, { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { connInfo } from '../../config/mariadb';
import { IAuthUser, accessTokenGenerate } from '../common';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios'; // Axios for making HTTP requests

interface IGoogleUser {
    sub: string,
    name: string,
    given_name: string,
    family_name: string,
    picture: string,
    email: string
  }
export const authGoogleLogin = async (req: Request, res: Response) => {
    

    const {  googleAccessToken } = req.body; // 클라이언트에서 받은 액세스 토큰
    const accessPrivateKey = process.env.ACCESS_PRIVATE_KEY;
    const refreshPrivateKey = process.env.REFRESH_PRIVATE_KEY;
    if (!accessPrivateKey || !refreshPrivateKey) {
      console.error('Info: PRIVATE_KEY가 환경변수로 지정되어있지 않음.');
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
    const conn = await mariadb.createConnection(connInfo);

    if (!googleAccessToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Access token is required' });
    }

    try {
        // 1. Google API를 사용해 액세스 토큰 검증 및 사용자 정보 가져오기
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        });

        // 2. 사용자 정보 추출
        const userData: IGoogleUser = response.data as IGoogleUser; // 여기서 사용자 정보를 가져옵니다.
        console.log(userData)

        // 2. 해당 유저가 존재하는 지 확인
        let sql = `SELECT * FROM User WHERE user_uuid = ? LIMIT 1`;
        let values = [userData.sub];
        let [results] = await conn.query(sql, values);
        const loginUser = (results as Array<{ id: number }>)[0];

        // 2-1. 없는 존재인 경우 회원 생성
        if (!loginUser.id) {
        sql = `
            INSERT INTO 
            User 
            (user_uuid, user_name, user_email) 
            VALUES 
            (?, ?, ?)`;
        values = [
            userData.sub,
            userData.name,
            userData.email
        ];
        [results] = await conn.query(sql, values);
        loginUser.id = (results as ResultSetHeader).insertId;
        }

        // 3-1. jwt 액세스 토큰 발행
        const accessTokenInfo: IAuthUser = {
        id: loginUser.id,
        uuid: userData.sub,
        userName: userData.name,
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
        console.log('Info: 토큰 발행');

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
        uuid: userData.sub,
        accessToken: instanceAccessToken,
        refreshToken: instanceRefreshToken,
        });

    } catch (error) {
        // 5. 에러 처리
        console.error('Error fetching user info:', error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid access token' });
    }
};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mariadb, { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { connInfo } from '../../config/mariadb';
import { IAuthUser, accessTokenGenerate } from '../common';
import axios from 'axios'; 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface IGoogleUser {
    sub: string,
    name: string,
    given_name: string,
    family_name: string,
    picture: string,
    email: string
  }
export const authGoogleLogin = async (req: Request, res: Response) => {
    const {  googleAccessToken } = req.body; 
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
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        });
        const userData: IGoogleUser = response.data as IGoogleUser; 

        let sql = `SELECT * FROM User WHERE user_uuid = ? LIMIT 1`;
        let values = [userData.sub];
        let [results] = await conn.query(sql, values);
        const loginUser = (results as Array<{ id: number }>)[0];

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

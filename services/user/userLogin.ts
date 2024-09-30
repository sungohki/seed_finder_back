// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// import local module
import { connection as conn } from '../../mariadb';
import { IUserAccount } from './userJoin';
import { RowDataPacket } from 'mysql2';
import { generateToken, ILoginUser } from '../common';

interface UserQueryResult extends IUserAccount, RowDataPacket {}

export const userLogin = (req: Request, res: Response) => {
  const { userEmail, userPw } = req.body as IUserAccount;
  const sql = `SELECT * FROM User WHERE user_email = ?`;
  const values = [userEmail];

  conn.query(sql, values, (err, results: UserQueryResult[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];
    if (!loginUser) {
      console.log(
        `Info: 로그인 실패 (Wrong userId) ` + userEmail + ', ' + loginUser
      );
      // return res.status(StatusCodes.NOT_FOUND).end(); // status code 404
      return res.status(StatusCodes.NOT_FOUND).json({
        message:
          `Info: 로그인 실패 (Wrong userId)` + userEmail + ', ' + loginUser,
      }); // status code 404
    }

    // req에 담긴 pw와 대조
    const hashedPassword = crypto
      .pbkdf2Sync(userPw, loginUser.salt, 10000, 64, 'sha512')
      .toString('base64');

    if (loginUser.user_pw == hashedPassword) {
      // .env ACCESS_PRIVATE_KEY, REFRESH_PRIVATE_KEY 확인
      const accessPrivateKey = process.env.ACCESS_PRIVATE_KEY;
      const refreshPrivateKey = process.env.REFRESH_PRIVATE_KEY;
      if (!accessPrivateKey || !refreshPrivateKey) {
        console.error('Info: PRIVATE_KEY가 환경변수로 지정되어있지 않음.');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
      console.log(
        `Info: [${loginUser.user_email}] 로그인 정보 일치, 로그인 성공`
      );

      // jwt 액세스 토큰 발행
      const accessTokenInfo: ILoginUser = {
        id: loginUser.id,
        userEmail: loginUser.user_email,
        userRole: loginUser.user_management,
      };
      const accessTokenOption: jwt.SignOptions = {
        expiresIn: '30m',
        issuer: 'sungohki',
      };
      const instanceAccessToken = generateToken(
        accessTokenInfo,
        accessPrivateKey,
        accessTokenOption
      );
      console.log('Info: 토큰 발행');

      // jwt 리프레시 토큰 발행
      const refreshTokenOption: jwt.SignOptions = {
        expiresIn: '7d', // 리프레시 토큰은 더 긴 유효기간을 가짐
        issuer: 'sungohki',
      };
      const instanceRefreshToken = generateToken(
        accessTokenInfo,
        refreshPrivateKey,
        refreshTokenOption
      );

      // 쿠키에 토큰 첨부
      res.cookie('accessToken', instanceAccessToken, {
        httpOnly: true,
      });
      console.log(instanceAccessToken);
      res.cookie('refreshToken', instanceRefreshToken, {
        httpOnly: true,
      });
      console.log(instanceRefreshToken);

      let memberRole;
      if (loginUser.user_management === 1) memberRole = 'MANAGER';
      else memberRole = 'CUSTOMER';

      return res.status(StatusCodes.OK).json({
        ...results[0],
        accessToken: instanceAccessToken,
        refreshToken: instanceRefreshToken,
        memberRole: memberRole,
      });
    } else {
      console.log('Info: 로그인 실패 (Wrong userPw)');
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });

  return res.status(StatusCodes.OK);
};

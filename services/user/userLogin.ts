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

interface UserQueryResult extends IUserAccount, RowDataPacket {}

export const userLogin = (req: Request, res: Response) => {
  const { userId, userPw } = req.body;
  const sql = `SELECT * FROM user WHERE userId = ?`;
  const values = [userId];

  conn.query(sql, values, (err, results: UserQueryResult[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];
    console.log(`Info: [ ${loginUser} ] 로그인 시도`);
    if (!loginUser) return res.status(StatusCodes.NOT_FOUND); // status code 404

    // req에 담긴 pw와 대조
    const hashedPassword = crypto
      .pbkdf2Sync(userPw, loginUser.salt, 10000, 64, 'sha512')
      .toString('base64');

    if (loginUser.userPw == hashedPassword) {
      console.log('Info: 로그인 정보 일치, 로그인 성공');
      // .env PRIVATE_KEY 확인
      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey) {
        console.error('Info: PRIVATE_KEY가 환경변수로 지정되어있지 않음.');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
      // jwt 토큰 발행
      const instanceToken = jwt.sign(
        {
          id: loginUser.id,
          userId: loginUser.userId,
        },
        privateKey,
        {
          expiresIn: '30m',
          issuer: 'sungohki',
        }
      );
      console.log('Info: 토큰 발행');
      // 쿠키에 토큰 첨부
      res.cookie('token', instanceToken, {
        httpOnly: true,
      });
      return res
        .status(StatusCodes.OK)
        .json({ ...results[0], token: instanceToken });
    } else {
      console.log('Info: 로그인 실패');
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });

  // return res.status(StatusCodes.OK);
};

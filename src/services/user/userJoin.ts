// Import node module
import { Request, Response } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Import local module
import { createRes } from '../common';
import { connection as conn } from '../../mariadb';
import { ResultSetHeader } from 'mysql2';
import { StatusCodes } from 'http-status-codes';
import { IUserAccount } from '.';

export const userJoin = (req: Request, res: Response) => {
  const { userName, userEmail, userPw, userContact, userCode } =
    req.body as IUserAccount;

  // 유효성 검사
  if (!userName || !userEmail || !userPw) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'info: 필수 입력 정보 (이름, id, pw) 미달',
    });
  }

  // Hashing password
  // randomBytes 메서드를 사용하여 64바이트의 무작위 salt 값을 생성하고 이를 base64 문자열로 변환
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(userPw, salt, 10000, 64, 'sha512')
    .toString('base64');
  /*
    pbkdf2Sync 메서드를 사용하여 비밀번호를 해싱(암호화)
    해싱 알고리즘으로 sha512를 사용하고, 해싱된 결과를 base64 문자열로 변환
  */

  const sql = `
    INSERT INTO 
      User 
      (user_email, user_pw, user_name, user_contact, salt, user_management) 
    VALUES 
      (?, ?, ?, ?, ?, ?)`;
  let values: Array<string | boolean | null>;
  if (userCode == process.env.MANAGER_CODE)
    values = [userEmail, hashedPassword, userName, userContact, salt, true];
  else if (userCode == null)
    values = [userEmail, hashedPassword, userName, userContact, salt, false];
  else
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'info: 틀린 매니저 코드',
    });

  conn.query<ResultSetHeader>(sql, values, (err, results) => {
    return createRes(res, err, results); // 201 | 204 | 400
  });
};

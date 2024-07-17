// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';

// import local module
import { createRes } from '../common';
import { connection as conn } from '../../mariadb';
import { ResultSetHeader } from 'mysql2';

export interface IUserAccount {
  userName: string;
  userId: string;
  userPw: string;
  userContact: string;
  salt: string;
}

export const userJoin = (req: Request, res: Response) => {
  const { userName, userId, userPw, userContact } = req.body;

  // Info: Hashing password
  const salt = crypto.randomBytes(64).toString('base64');
  // randomBytes 메서드를 사용하여 64바이트의 무작위 salt 값을 생성하고 이를 base64 문자열로 변환
  const hashedPassword = crypto
    .pbkdf2Sync(userPw, salt, 10000, 64, 'sha512')
    .toString('base64');
  /*
    pbkdf2Sync 메서드를 사용하여 비밀번호를 해싱(암호화)
    해싱 알고리즘으로 sha512를 사용하고, 해싱된 결과를 base64 문자열로 변환
  */

  // TODO) 계정 생성 이전에 중복된 id가 있는지 확인 후 생성 (비동기 처리 필요)
  const sql: string = `
    INSERT INTO 
      user 
      (userName, userId, userPw, userContact, salt) 
    VALUES 
      (?, ?, ?, ?, ?)`;
  const values: Array<any> = [
    userName,
    userId,
    hashedPassword,
    userContact,
    salt,
  ];
  conn.query<ResultSetHeader>(sql, values, (err, results) => {
    createRes(res, err, results);
  });
};

// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../mariadb';
import {
  accessTokenVerify,
  convertKeysToCamelCase,
  queryErrorChecker,
} from '../common';

interface IUserProfile {
  id: number;
  userEmail: string;
  userName: string;
  userContact: string;
  userAge: number;
  userSexuality_id: number;
  preBusiness_status: number;
  businessDuration: number | null;
  userUuid: string;
}

export const userGetProfile = (req: Request, res: Response) => {
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const sql = `SELECT * FROM User WHERE id = ?`;
  const values = [decodedUserAccount.id];

  conn.query(sql, values, (err, results) => {
    if (queryErrorChecker(err, res)) return;
    const userProfile = Object.values(results)[0] as IUserProfile;
    return res.status(StatusCodes.OK).json(userProfile);
  });
};

// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import mariadb from 'mysql2/promise';
import { connInfo } from '../../mariadb';
import { accessTokenVerify } from '../common';
import { IBusinessPreview } from '../business';

export const favoritePersonalList = async (req: Request, res: Response) => {
  // TODO) 로그인 토큰 확인
  const decodedUserAccount = accessTokenVerify(req, res);
  if (decodedUserAccount === null) return;
  const conn = await mariadb.createConnection(connInfo);

  let sql = `
    SELECT
      announcement_id
    FROM
      User_Favorite_Business
    WHERE
      user_id = ?
  `;
  let values: Array<number> = [decodedUserAccount.id];
  let results;

  try {
    // 1. 위시리스트 id 목록 받아오기
    [results] = await conn.query(sql, values);
    values = [];
    for (let item of Object.values(results) as Array<{
      announcement_id: number;
    }>)
      values.push(item.announcement_id);
    console.log(`info: ${values} (user_id : ${decodedUserAccount.id})`);
    if (!values.length) return res.status(StatusCodes.OK).json([]);

    // 2. id 목록에 해당하는 사업 데이터들 가져오기
    sql = `
      SELECT
        A.id, 
        A.integrated_project_name, 
        BC.name AS business_classification_name,
        A.start_date, 
        A.end_date
      FROM
        Announcement A
      JOIN
        Business_Classification BC
        ON A.business_classification_id = BC.id
      where
        A.id in (?)
    `;
    [results] = await conn.query(sql, [values]);
    return res
      .status(StatusCodes.OK)
      .json(Object.values(results) as Array<IBusinessPreview>); // 200
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).json(e); // 400
  } finally {
    await conn.end();
  }
};

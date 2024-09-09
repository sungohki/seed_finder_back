// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connection as conn } from '../../mariadb';

export const businessToggleFavorite = (req: Request, res: Response) => {
  // TODO) 로그인 토큰 확인
  // TODO) 위시리스트 테이블 조회 where uid = ?
  // TODO) 받아온 bid들을 통해 where bid in (?)
  return res.status(StatusCodes.OK).json();
  //   return res.status(StatusCodes.BAD_REQUEST).json({
  //     request: '위시리스트 조회',
  //     response: '요청 처리 실패',
  //   });
};

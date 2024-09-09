// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import mariadb from 'mysql2/promise';
import { connection as conn } from '../../mariadb';

export const businessGetFavorite = (req: Request, res: Response) => {
  // TODO) 로그인 토큰 확인
  // TODO) 위시리스트 true/false 여부
  // TODO) true인 경우
  // TODO) false인 경우
  return res.status(StatusCodes.OK).json();
  //   return res.status(StatusCodes.BAD_REQUEST).json({
  //     request: '위시리스트 추가/삭제',
  //     response: '요청 처리 실패',
  //   });
};

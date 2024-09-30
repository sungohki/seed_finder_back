import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  JwtPayload,
} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { refreshAccessToken } from './refreshAccessToken';
import { ILoginUser } from './generateToken';

dotenv.config();

export interface DecodedToken extends JwtPayload, ILoginUser {
  // 토큰에 포함될 추가적인 정보가 있을 시 정의할 것
}

export const verifyAccessToken = (
  req: Request,
  res: Response
): DecodedToken | null => {
  try {
    // 1. 액세스 토큰 제출 여부 확인
    const receivedToken = req.headers['authorization'];
    if (!receivedToken) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: `Info: 액세스 토큰 부재. 재 로그인 필요.`,
      });
      return null; // 공란일 시 null
    }

    // 2. 액세스 토큰 복호화
    const decodedToken = jwt.verify(
      receivedToken,
      process.env.ACCESS_PRIVATE_KEY as string
    ) as DecodedToken;
    return decodedToken; // 2-1. 복호화된 사용자 정보 객체 반환
  } catch (err) {
    return errorResController(err, req, res); // 2-2. 에러 메시지와 함께 null 반환
  }
};

function errorResController(err: unknown, req: Request, res: Response): null {
  if (err instanceof TokenExpiredError) {
    // res.status(StatusCodes.UNAUTHORIZED).json({
    //   message: `${err.name}: 로그인 토큰 만료. 토큰 재발급 확인`,
    // });
    console.log(`${err.name}: 로그인 토큰 만료. 토큰 재발급 확인`);
    refreshAccessToken(req, res); // 토큰 리프레시
  } else if (err instanceof JsonWebTokenError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `${err.name}: 잘못된 토큰`,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `${(err as Error).name}: 잘못된 요청`,
    });
  }
  return null;
}

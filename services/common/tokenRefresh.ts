// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Import local module
import { tokenGenerate, ILoginUser } from './tokenGenerate';

export const tokenRefresh = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const accessPrivateKey = process.env.ACCESS_PRIVATE_KEY;
  const refreshPrivateKey = process.env.REFRESH_PRIVATE_KEY;

  if (!refreshToken || !refreshPrivateKey || !accessPrivateKey) {
    console.log('info: Private Key 부재. 토큰 재발급 불가');
    return res.status(StatusCodes.UNAUTHORIZED).end();
  }

  jwt.verify(refreshToken, refreshPrivateKey, (err: unknown, user: any) => {
    if (err) {
      console.log(err);
      console.log('info: 리프레시 토큰 검증 실패. (재 로그인 필요)');
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: `리프레시 토큰 만료 (${err.name})`,
        });
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `잘못된 토큰 (${err.name})`,
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `잘못된 요청 (${(err as Error).name})`,
        });
      }
    }

    // 유저 정보로 새로운 액세스 토큰 발급
    const tokenInfo: ILoginUser = {
      id: user.id,
      userEmail: user.userEmail,
    };
    const tokenOption: jwt.SignOptions = {
      expiresIn: '1h',
      issuer: 'sungohki',
    };
    const newAccessToken = tokenGenerate(
      tokenInfo,
      accessPrivateKey,
      tokenOption
    );
    console.log('info: 새 액세스 토큰 발행');

    return res.status(StatusCodes.OK).json({
      accessToken: newAccessToken,
    });
  });
};

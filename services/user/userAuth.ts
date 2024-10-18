// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface Data {
  grant_type: string;
  client_id: string;
  code: string;
  [key: string]: string;
}

export const userAuth = async (req: Request, res: Response) => {
  const { code } = req.body; // 인가코드
  const restApiKey = process.env.REST_API_KEY as string; // 앱키 Rest API key
  if (!restApiKey) {
    console.error('info: REST_API_KEY not found');
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'REST_API_KEY not found',
    });
  }
  const data: Data = {
    grant_type: 'authorization_code',
    client_id: restApiKey,
    code,
  };
  console.log(data);
  const header = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    Authorization: 'Bearer ',
  };
  console.log(header);

  const dataQueryString = Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
  // grant_type=authorization_code&client_id=your_client_id&code=authorization_code_here
  console.log(dataQueryString);
  const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/token';
  const kakaoToken = await axios.post(kakaoAuthUrl, dataQueryString, {
    headers: header,
  });
  console.log(kakaoToken);

  return res.status(StatusCodes.OK).json(kakaoToken);
};

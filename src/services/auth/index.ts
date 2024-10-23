export * from './authKakaoLogin';
export * from './authGoogleLogin';
export * from './authRefreshToken';

export interface IKakaoUser {
  id: string;
  kakao_account: {
    name: string;
    gender: string;
    phone_number: string;
  };
}

export interface IGoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}

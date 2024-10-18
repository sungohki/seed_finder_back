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

import jwt from 'jsonwebtoken';

export interface ILoginUser {
  id: number;
  userId: string;
}

export const generateToken = (
  user: ILoginUser,
  tokenKey: jwt.Secret,
  options?: jwt.SignOptions
) => {
  return jwt.sign(user, tokenKey, options);
};

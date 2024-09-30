// Import node module
import jwt from 'jsonwebtoken';

export interface ILoginUser {
  id: number;
  userEmail: string;
  userRole: number;
}

export const accessTokenGenerate = (
  user: ILoginUser,
  tokenKey: jwt.Secret,
  options?: jwt.SignOptions
) => {
  return jwt.sign(user, tokenKey, options);
};

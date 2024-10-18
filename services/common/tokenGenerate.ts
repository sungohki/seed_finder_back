// Import node module
import jwt from 'jsonwebtoken';

// Import local mocule

export interface ILoginUser {
  id: number;
  userEmail: string;
}
export interface IAuthUser {
  id: number;
  uuid: string;
  userName: string;
}
export const tokenGenerate = (
  user: ILoginUser | IAuthUser,
  tokenKey: jwt.Secret,
  options?: jwt.SignOptions
) => {
  return jwt.sign(user, tokenKey, options);
};

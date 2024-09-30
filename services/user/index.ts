export * from './userJoin';
export * from './userLogin';
export * from './userGetInfo';
export * from './userSurveyInfo';
export * from './userSurveyOption';
export * from './userTestToken';
export * from './userSurveyCheck';

export interface IUserAccount {
  userName: string;
  userEmail: string;
  userPw: string;
  userContact: string;
  salt: string;
  userCode: string | null;
}

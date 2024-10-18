export * from './userJoin';
export * from './userLogin';
export * from './userAuth';
export * from './userGetInfo';
export * from './userSurveyInfo';
export * from './userSurveyOption';
export * from './userSurveyCheck';

export interface IUserAccount {
  userName: string;
  userEmail: string;
  userPw: string;
  userContact: string;
  salt: string;
  userCode: string | null;
}

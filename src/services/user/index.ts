// export * from './userJoin';
// export * from './userLogin';
export * from './userGetProfile';
export * from './userGetInfo';
export * from './userSurveyInfo';
export * from './userSurveyOption';
export * from './userCheckInfo';
export * from './userDelete';

export interface IUserAccount {
  userName: string;
  userEmail: string;
  userPw: string;
  userContact: string;
  salt: string;
  userCode: string | null;
}

import type { Config } from 'jest';

export const config: Config = {
  preset: 'ts-jest', // ts-jest를 사용하도록 프리셋 설정
  testEnvironment: 'node', // 테스트 환경을 Node.js로 설정
  testMatch: ['**/__tests__/**/*.test.ts'], // 테스트 파일 경로 패턴
  moduleFileExtensions: ['ts', 'js'], // 모듈 확장자 설정
  globals: {
    'ts-jest': {
      tsconfig: '../tsconfig.json', // tsconfig 설정 파일 경로
    },
  },
};

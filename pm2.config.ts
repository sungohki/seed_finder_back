module.exports = {
  apps: [
    {
      name: 'app-name', // 애플리케이션 이름
      script: './src/app.ts', // 실행할 TypeScript 파일
      interpreter: 'ts-node', // ts-node로 TypeScript 실행
      watch: true, // 파일이 변경되면 자동으로 다시 시작
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

module.exports = {
  apps: [
    {
      name: 'app',
      script: './index.ts', // 실행할 TypeScript 파일
      interpreter: 'ts-node', // ts-node로 TypeScript 실행
      watch: true, // 파일이 변경되면 자동으로 다시 시작
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

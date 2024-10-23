module.exports = {
  apps: [
    {
      name: 'seedfinder',
      script: './dist/src/index.js',
      interpreter: 'ts-node',
      instances: 0,
      watch: true,
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

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Seed Finder API',
      version: '1.0.0',
      description:
        'This is a CRUD API application made with Express and Typescript. Documented with Swagger API',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'sungohki',
        url: 'https://github.com/sungohki/seed_finder_back',
        email: 'sokim1201@naver.com',
      },
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        Authorization: [], // 전역적으로 토큰이 필요한 경우
      },
    ],
    // servers: [
    //   {
    //     url: 'http://localhost:3000',
    //   },
    // ],
  },
  apis: ['./swagger/*.swagger.ts'], // API 경로
};

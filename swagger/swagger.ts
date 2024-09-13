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
      schemas: {
        BusinessPreview: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64', example: '1' },
            integrated_project_name: {
              type: 'string',
              example: '청년 창업 지원 사업',
            },
            business_classitication_name: { type: 'string', example: '대학생' },
            start_date: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01',
            },
            end_date: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-31',
            },
          },
        },
      },
    },
    security: [
      {
        Authorization: [], // 전역적으로 토큰이 필요한 경우
      },
    ],
  },
  apis: ['./swagger/*.swagger.ts'], // API 경로
};

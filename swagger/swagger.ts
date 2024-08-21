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
    // servers: [
    //   {
    //     url: 'http://localhost:3000',
    //   },
    // ],
  },
  apis: ['./swagger/*.swagger.ts'], // API 경로
};

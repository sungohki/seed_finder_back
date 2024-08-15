import dotenv from 'dotenv';
import app from './app';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Load environment variables
dotenv.config();

// Retrieve the port number
const port = process.env.PORT || 3000;
const host = process.env.DOMAIN || 'localhost';

// Swagger 설정
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Seed Finder API',
      version: '1.0.0',
      description:
        'This is a simple CRUD API application made with Express and Typescript. Documented with Swagger API',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'sungohki',
        url: 'https://github.com/sungohki',
        email: 'sokim1201@naver.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.ts'], // API 경로
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Open server with port number
app.listen(port, () => {
  console.log(`Server is open at http://${host}:${port}`);
});

/**
 *  @swagger
 *  paths:
 *   /user:
 *     /join:
 *       post:
 *         summary: Create new user data
 *         tags: [User]
 *         requestBody:
 *           required: true
 *           content:
 *             application/json:
 *         responses:
 *           "200":
 *             description: Create new user.
 *             content:
 *               application/json:
 *     /login:
 *       post:
 *         summary: Create new login token for user that tried login
 *         tags: [User]
 *         requestBody:
 *           required: true
 *           content:
 *             application/json:
 *         responses:
 *           "200":
 *             description: Create new login token.
 *             content:
 *               application/json:
 *     /info:
 *       post:
 *         summary: Create new information of user
 *         tags: [User]
 *         requestBody:
 *           required: true
 *           content:
 *             application/json:
 *         responses:
 *           "200":
 *             description: Create user info
 *             content:
 *               application/json:
 *       put:
 *         summary: Update the information of user
 *         tags: [User]
 *         requestBody:
 *           required: true
 *           content:
 *             application/json:
 *         responses:
 *           "200":
 *             description: Update user info
 *             content:
 *               application/json:
 */

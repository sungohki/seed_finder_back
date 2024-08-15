import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// import routes
import { userRouter } from './routes/userRoutes';
import { businessRouter } from './routes/businessRoutes';

// routing uri
app.get('/', (req: Request, res: Response) => {
  console.log('Main Page Access');
  return res.json({
    name: 'main page',
  });
});
app.use('/user', userRouter);
app.use('/business', businessRouter);

export default app;

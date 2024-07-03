import express, { Request, Response } from 'express';

const app = express();

// import routes
import { userRouter } from './routes/userRoutes';
import { businessRouter } from './routes/businessRoutes';

// routing uri
app.get('/', (req: Request, res: Response) => {
  console.log('Main Page');
  return res.json({
    name: 'main page',
  });
});
app.use('/user', userRouter);
app.use('/business', businessRouter);

export default app;

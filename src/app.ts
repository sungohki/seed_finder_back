// Import node module
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

// Import routes
import * as routes from './routes';

const app = express();
app.use(cookieParser());

// Routing URI
app.get('/', (req: Request, res: Response) => {
  console.log('Main Page Access');
  return res.json({
    name: 'main page',
  });
});
app.use('/user', routes.userRouter);
app.use('/business', routes.businessRouter);
app.use('/favorite', routes.favoriteRouter);
app.use('/docs', routes.supportRouter);
app.use('/auth', routes.authRouter);

// Route for test functions
app.use('/test', routes.testRouter);

export default app;

import express, { Request, Response } from 'express';

const app = express();

// import routes
import * as routes from './routes';

// routing uri
app.get('/', (req: Request, res: Response) => {
  console.log('Main Page Access');
  return res.json({
    name: 'main page',
  });
});
app.use('/user', routes.userRouter);
app.use('/business', routes.businessRouter);
app.use('/favorite', routes.favoriteRouter);
app.use('/chatroom', routes.chatroomRouter);
app.use('/chat', routes.chatRouter);

export default app;

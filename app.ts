import express, { Request, Response } from 'express';

const app = express();

// Routing
app.get('/', (req: Request, res: Response) => {
  // res.write('Server starts');
  return res.end(200);
});
app.use('/users');
app.use('/users');

export default app;

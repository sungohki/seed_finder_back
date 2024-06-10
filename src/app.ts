import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';

// Use environmental variable
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Open port
app.listen(port, () => {});

// Routing
app.get('/', (req: Request, res: Response) => {
  res.write(`Server is open at port number ${port}`);
  return res.status(StatusCodes.OK).end();
});

export default app;

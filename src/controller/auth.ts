import express, { Request, Response } from 'express';
import auth from '../service/auth';
import { limit } from '../middleware/limit';

const app = express();

app.post('/signup', limit, (req: Request, res: Response) => {
  auth.signUp(req, res);
});

export default app;

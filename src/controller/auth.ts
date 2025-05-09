import express, { Request, Response } from 'express';
import auth from '../service/auth';

const app = express();

app.post('/signup', (req: Request, res: Response) => {
  auth.signUp(req, res);
});

export default app;

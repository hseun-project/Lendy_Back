import express, { Request, Response } from 'express';
import auth from '../service/auth';
import { postApiLimit } from '../middleware/limit';

const app = express();

app.post('/signup', postApiLimit, (req: Request, res: Response) => {
  auth.signUp(req, res);
});
app.post('/login', postApiLimit, (req: Request, res: Response) => {
  auth.login(req, res);
});

export default app;

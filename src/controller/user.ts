import express, { Request, Response } from 'express';
import user from '../service/user';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';

const app = express.Router();

app.get('/info', getApiLimit, verifyJWT, (req: Request, res: Response) => {
  user.userInfo(req, res);
});
app.get('/apply', getApiLimit, verifyJWT, (req: Request, res: Response) => {
  user.myApplyLoan(req, res);
});

export default app;

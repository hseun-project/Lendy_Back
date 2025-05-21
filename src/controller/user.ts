import express, { Response } from 'express';
import user from '../service/user';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';

const app = express.Router();

app.get('/info', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.userInfo(req, res);
});
app.get('/apply', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  user.myApplyLoan(req, res);
});

export default app;

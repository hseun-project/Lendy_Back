import express, { Response } from 'express';
import repay from '../service/repay';
import { getApiLimit, apiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';

const app = express.Router();

app.get('/', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  repay.repayLoanList(req, res);
});

export default app;

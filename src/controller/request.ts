import express, { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import request from '../service/request';

const app = express.Router();

app.get('/:loanType', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  request.requestLoanList(req, res);
});

export default app;

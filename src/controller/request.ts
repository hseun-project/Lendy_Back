import express, { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { apiLimit, getApiLimit } from '../middleware/limit';
import { verifyJWT } from '../middleware/jwt';
import request from '../service/request';

const app = express.Router();

app.get('/list/:loanType', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  request.requestLoanList(req, res);
});
app.get('/:applyLoanId', getApiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  request.requestLoan(req, res);
});
app.patch('/:applyLoanId', apiLimit, verifyJWT, (req: AuthenticatedRequest, res: Response) => {
  request.changeState(req, res);
});

export default app;

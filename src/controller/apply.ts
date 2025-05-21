import express, { Response } from 'express';
import apply from '../service/apply';
import { verifyJWT } from '../middleware/jwt';
import { AuthenticatedRequest } from '../types';
import { apiLimit } from '../middleware/limit';
import { ApplyLoanRequest } from '../types/apply';

const app = express.Router();

app.post('/', apiLimit, verifyJWT, (req: AuthenticatedRequest<{}, {}, ApplyLoanRequest>, res: Response) => {
  apply.applyLoan(req, res);
});

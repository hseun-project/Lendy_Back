import { DuringType, LoanType } from '../config/prisma';

export interface ApplyLoanRequest {
  loanType: LoanType;
  money: number;
  interest: string;
  duringType: DuringType;
  during: number;
  bondName: string | null;
  bondEmail: string | null;
}

import { LoanType, DuringType, ApplyLoanState } from '../config/prisma';

export interface UserInfoResponse {
  email: string;
  name: string;
  creditScore: number;
  banks: {
    bankName: string;
    bankNumberMasked: string;
  }[];
}

export interface MyApplyLoanData {
  id: bigint;
  loanType: LoanType;
  money: number;
  interest: string;
  duringType: DuringType;
  during: number;
  bondName?: string | null;
  state: ApplyLoanState;
}

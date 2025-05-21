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

export interface ApplyUserQuery {
  keyword?: string;
  offset?: number;
}

export interface ApplyBondUserData {
  name: string;
  email: string;
}

export interface ApplyBondUserResponse {
  offset: number;
  users: ApplyBondUserData[];
}

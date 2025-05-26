import { DuringType } from '../config/prisma';

export interface RequestLoanListData {
  id: bigint;
  debtName: string;
  creditScore: number;
  money: number;
  duringType: DuringType;
  during: number;
}

export interface RequestLoanListResponse {
  offset: number;
  totalLoans: number;
  requestLoans: RequestLoanListData[];
}

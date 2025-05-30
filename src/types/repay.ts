import { DuringType } from '../config/prisma';

export interface RepayItemData {
  id: bigint;
  money: number;
  duringType: DuringType;
  during: number;
  startDate: Date;
  repay: number;
}

export interface RepayResponse {
  id: bigint;
  bondName: string;
  bankName: string;
  bankNumberMasked: string;
  money: number;
  duringType: DuringType;
  during: number;
  startDate: Date;
  interest: string;
  repay: number;
}

import { DuringType } from '../config/prisma';

export interface RepayItemData {
  id: bigint;
  money: number;
  duringType: DuringType;
  during: number;
  startDate: Date;
  repay: number;
}

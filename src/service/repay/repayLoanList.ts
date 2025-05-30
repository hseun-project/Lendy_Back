import { Response } from 'express';
import { AuthenticatedRequest, BasicResponse } from '../../types';
import { prisma } from '../../config/prisma';
import { RepayItemData } from '../../types/repay';

export const repayLoanList = async (req: AuthenticatedRequest, res: Response<RepayItemData[] | BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }

    const repays = await prisma.loan.findMany({
      select: { id: true, money: true, duringType: true, during: true, startDate: true, repay: true },
      where: { debtId: userId }
    });

    return res.status(200).json(repays);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

import { Response } from 'express';
import { prisma } from '../../config/prisma';
import { BasicResponse, AuthenticatedRequest } from '../../types';
import { MyApplyLoanData } from '../../types/user';

export const myApplyLoan = async (req: AuthenticatedRequest, res: Response<MyApplyLoanData[] | BasicResponse>) => {
  try {
    const payload = req.payload;
    if (!payload || payload.type !== 'access') {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }

    const userId = Number(payload.id);
    if (isNaN(userId)) {
      return res.status(400).json({
        message: '잘못된 사용자 ID 형식'
      });
    }

    const applyLoans = await prisma.applyLoan.findMany({
      where: { debtId: userId },
      select: {
        id: true,
        loanType: true,
        money: true,
        interest: true,
        duringType: true,
        during: true,
        state: true,
        bondApply: { select: { userDetail: { select: { userName: true } } } }
      }
    });
    const result: MyApplyLoanData[] = applyLoans.map((loan) => ({
      id: loan.id,
      loanType: loan.loanType,
      money: loan.money,
      interest: loan.interest.toString(),
      duringType: loan.duringType,
      during: loan.during,
      bondName: loan.bondApply?.userDetail?.userName || null,
      state: loan.state
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

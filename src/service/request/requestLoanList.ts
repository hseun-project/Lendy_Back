import { AuthenticatedRequest, BasicResponse } from '../../types';
import { Response } from 'express';
import { LoanType, prisma } from '../../config/prisma';
import { RequestLoanListResponse } from '../../types/request';

const PAGE_SIZE = 20;

export const requestLoanList = async (req: AuthenticatedRequest, res: Response<RequestLoanListResponse | BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }

    const { offset } = req.query;

    const loanType = req.params.loanType;
    if (loanType !== LoanType.PRIVATE_LOAN || loanType !== LoanType.PUBLIC_LOAN) {
      return res.status(400).json({
        message: '올바르지 않은 파라미터'
      });
    }

    const where = {
      loanType: loanType,
      ...(loanType === LoanType.PRIVATE_LOAN && {
        bondId: userId
      })
    };

    const [requestLoans, totalLoans] = await prisma.$transaction([
      prisma.applyLoan.findMany({
        select: {
          id: true,
          debtApply: {
            select: {
              userDetail: { select: { userName: true } },
              creditScore: true
            }
          },
          money: true,
          duringType: true,
          during: true
        },
        where: where,
        skip: PAGE_SIZE * Math.max((Number(offset) || 1) - 1, 0),
        take: PAGE_SIZE
      }),
      prisma.applyLoan.count({
        where: where
      })
    ]);

    const result = requestLoans.map((loan) => ({
      id: loan.id,
      debtName: loan.debtApply.userDetail?.userName || '대출자',
      creditScore: loan.debtApply.creditScore,
      money: loan.money,
      duringType: loan.duringType,
      during: loan.during
    }));

    return res.status(200).json({
      offset: Number(offset) || 1,
      totalLoans: totalLoans,
      requestLoans: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

import { AuthenticatedRequest, BasicResponse } from '../../types';
import { Response } from 'express';
import { DuringType, prisma } from '../../config/prisma';
import { RequestLoanResponse } from '../../types/request';

export const requestLoan = async (req: AuthenticatedRequest, res: Response<RequestLoanResponse | BasicResponse>) => {
  try {
    const applyLoanId = req.params.applyLoanId;
    if (!applyLoanId) {
      return res.status(400).json({
        message: '올바르지 않은 파라미터터'
      });
    }

    const requestLoan = await prisma.applyLoan.findUnique({
      select: {
        id: true,
        debtApply: {
          select: {
            userDetail: { select: { userName: true } }
          }
        },
        duringType: true,
        during: true,
        money: true,
        interest: true
      },
      where: { id: applyLoanId }
    });

    if (!requestLoan) {
      return res.status(404).json({
        message: '존재하지 않는 대출 요청입니다'
      });
    }

    return res.status(200).json({
      id: applyLoanId,
      debtName: requestLoan.debtApply.userDetail?.userName || '대출자',
      money: requestLoan.money,
      interest: requestLoan.interest.toString(),
      duringType: requestLoan.duringType,
      during: requestLoan.during
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

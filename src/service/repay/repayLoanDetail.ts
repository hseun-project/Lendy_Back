import { Response } from 'express';
import { AuthenticatedRequest, BasicResponse } from '../../types';
import { RepayResponse } from '../../types/repay';
import { prisma } from '../../config/prisma';

export const repayLoanDetail = async (req: AuthenticatedRequest, res: Response<RepayResponse | BasicResponse>) => {
  try {
    const loanId = req.params.loanId;
    if (!loanId) {
      return res.status(400).json({
        message: '올바르지 않은 파라미터'
      });
    }

    const repay = await prisma.loan.findUnique({
      select: {
        id: true,
        bondLoan: {
          select: {
            userDetail: {
              select: {
                userName: true,
                bank: { select: { bankName: true, bankNumberMasked: true } }
              }
            }
          }
        },
        money: true,
        duringType: true,
        during: true,
        startDate: true,
        interest: true,
        repay: true
      },
      where: { id: loanId }
    });

    if (!repay) {
      return res.status(404).json({
        message: '반환 정보를 찾을 수 없습니다'
      });
    }

    return res.status(200).json({
      id: repay.id,
      bondName: repay.bondLoan.userDetail?.userName || '채권자 이름',
      bankName: repay.bondLoan.userDetail?.bank?.bankName || '은행명',
      bankNumberMasked: repay.bondLoan.userDetail?.bank?.bankNumberMasked || '',
      money: repay.money,
      duringType: repay.duringType,
      during: repay.during,
      startDate: repay.startDate,
      interest: repay.interest.toString(),
      repay: repay.repay
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

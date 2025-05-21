import { Response } from 'express';
import { BasicResponse, AuthenticatedRequest } from '../../types';
import { ApplyLoanRequest } from '../../types/apply';
import { prisma } from '../../config/prisma';

export const applyLoan = async (req: AuthenticatedRequest<{}, {}, ApplyLoanRequest>, res: Response<BasicResponse>) => {
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
        message: '토큰 검증 실패'
      });
    }

    const { loanType, money, interest, duringType, during, bondEmail } = req.body;
    if (!loanType || !money || !interest || !duringType || !during) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const bondUser = bondEmail ? await prisma.user.findUnique({ where: { email: bondEmail } }) : undefined;
    if (loanType === 'PRIVATE_LOAN' && !bondUser) {
      return res.status(404).json({
        message: '개인 대출 요청 대상 존재하지 않는 사용지'
      });
    }

    await prisma.applyLoan.create({
      data: {
        debtApply: { connect: { id: userId } },
        loanType: loanType,
        money: money,
        interest: parseFloat(interest),
        duringType: duringType,
        during: during,
        ...(bondUser && { bondApply: { connect: { id: bondUser.id } } })
      }
    });

    return res.status(201).json({
      message: '대출 신청 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

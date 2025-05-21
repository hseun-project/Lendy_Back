import { Response } from 'express';
import { BasicResponse, AuthenticatedRequest } from '../../types';
import { ApplyLoanRequest } from '../../types/apply';
import { prisma } from '../../config/prisma';

export const applyLoan = async (req: AuthenticatedRequest<{}, {}, ApplyLoanRequest>, res: Response<BasicResponse>) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }

    const { loanType, money, interest, duringType, during, bondEmail } = req.body;
    if (!loanType || !money || !interest || !duringType || !during || money <= 0 || during <= 0) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const interestValue = parseFloat(interest);

    if (isNaN(interestValue) || interestValue > 20) {
      return res.status(400).json({
        message: '최대 이자율 초과'
      });
    }

    const aggregateResult = await prisma.applyLoan.aggregate({ where: { debtId: userId }, _sum: { money: true } });
    const totalMoney = aggregateResult._sum.money || 0;
    if (totalMoney + money > 1000000) {
      return res.status(400).json({
        message: '최대 대출 한도 초과'
      });
    }

    // 상환이 완료되지 않은 대출이 있음에도 신청을 헀다면 신용점수 down

    const bondUser = bondEmail ? await prisma.user.findUnique({ where: { email: bondEmail } }) : undefined;
    if (loanType === 'PRIVATE_LOAN' && !bondUser) {
      return res.status(404).json({
        message: '개인 대출 요청 대상 존재하지 않는 사용자'
      });
    }

    await prisma.applyLoan.create({
      data: {
        debtApply: { connect: { id: userId } },
        loanType: loanType,
        money: money,
        interest: interestValue,
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

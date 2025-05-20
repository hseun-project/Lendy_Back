import { Response } from 'express';
import { prisma } from '../../config/prisma';
import { BasicResponse, AuthenticatedRequest } from '../../types';
import { UserInfoResponse } from '../../types/user';

export const userInfo = async (req: AuthenticatedRequest, res: Response<UserInfoResponse | BasicResponse>) => {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        creditScore: true,
        userDetail: { select: { userName: true } },
        bank: { select: { bankName: true, bankNumberMasked: true } }
      }
    });
    if (!user) {
      return res.status(404).json({
        message: '존재하지 않는 사용자'
      });
    }

    return res.status(200).json({
      email: user.email,
      name: user.userDetail?.userName || '',
      creditScore: user.creditScore,
      banks: user.bank
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

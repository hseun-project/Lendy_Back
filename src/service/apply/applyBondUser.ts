import { AuthenticatedRequest, BasicResponse } from '../../types';
import { Response } from 'express';
import { ApplyBondUserData, ApplyUserQuery, ApplyBondUserResponse } from '../../types/apply';
import { prisma } from '../../config/prisma';

export const applyBondUser = async (req: AuthenticatedRequest<{}, ApplyUserQuery, {}>, res: Response<ApplyBondUserResponse | BasicResponse>) => {
  const pageSize = 10;

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

    const { keyword, offset } = req.query;
    if (!keyword) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const bondUsers = await prisma.user.findMany({
      select: {
        email: true,
        userDetail: { select: { userName: true } }
      },
      where: {
        OR: [
          {
            userDetail: {
              userName: {
                contains: keyword,
                mode: 'insensitive'
              }
            }
          },
          {
            email: {
              contains: keyword,
              mode: 'insensitive'
            }
          }
        ]
      },
      take: pageSize,
      skip: pageSize * Math.max((offset || 1) - 1, 0),
      orderBy: [{ email: 'asc' }, { userDetail: { userName: 'asc' } }]
    });

    const result: ApplyBondUserData[] = bondUsers.map((user) => ({
      name: user.userDetail?.userName || '무명',
      email: user.email
    }));

    return res.status(200).json({
      offset: offset || 1,
      users: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

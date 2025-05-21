import { AuthenticatedRequest, BasicResponse } from '../../types';
import { Response } from 'express';
import { ApplyBondUserData, ApplyUserQuery, ApplyBondUserResponse } from '../../types/apply';
import { prisma } from '../../config/prisma';

const PAGE_SIZE = 10;
const DEFAULT_USER_NAME = '무명';

export const applyBondUser = async (req: AuthenticatedRequest<{}, ApplyUserQuery, {}>, res: Response<ApplyBondUserResponse | BasicResponse>) => {
  try {
    const { keyword, offset } = req.query;
    if (!keyword) {
      return res.status(400).json({
        message: '올바르지 않은 입력값'
      });
    }

    const numOffset = Math.max(offset || 1, 0);

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
      take: PAGE_SIZE,
      skip: PAGE_SIZE * (numOffset - 1),
      orderBy: [{ email: 'asc' }, { userDetail: { userName: 'asc' } }]
    });

    const result: ApplyBondUserData[] = bondUsers.map((user) => ({
      name: user.userDetail?.userName || DEFAULT_USER_NAME,
      email: user.email
    }));

    return res.status(200).json({
      offset: numOffset,
      users: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import { BasicResponse } from '../../types';
import { userToken } from './token';
import { userInfo } from './userInfo';

export const openCode = async (req: Request, res: Response<BasicResponse>) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({
      message: '잘못된 요청입니다'
    });
  }

  const strState = String(state);
  const strCode = String(code);

  try {
    const user = await prisma.user.findUnique({ where: { state: strState } });
    if (!user) {
      return res.status(404).json({
        message: '사용자를 찾을 수 없습니다'
      });
    }

    await prisma.userDetail.create({
      data: {
        user: {
          connect: { id: user.id }
        },
        userCode: strCode
      }
    });

    await userToken(strCode);
    await userInfo(strCode);

    return res.status(200).json({
      message: '본인 인증 완료'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};

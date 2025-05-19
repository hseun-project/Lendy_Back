import { Response } from 'express';
import redis from '../../config/redis';
import { BasicResponse } from '../../types';
import { AuthenticatedRequest } from '../../types/auth';

export const logout = async (req: AuthenticatedRequest, res: Response<BasicResponse>) => {
  try {
    const payload = req.payload;
    if (!payload) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }
    const userId = payload.id;
    await redis.del(`refresh ${userId}`);
    await redis.del(userId);

    return res.status(200).json({
      message: '로그아웃 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '로그아웃 실패'
    });
  }
};

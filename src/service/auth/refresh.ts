import { Response } from 'express';
import { BasicResponse } from '../../types';
import { AuthenticatedRequest, TokenResponse } from '../../types/auth';
import redis from '../../config/redis';
import { generateToken } from '../../utils/jwt';
import crypto from 'crypto';

export const refresh = async (req: AuthenticatedRequest, res: Response<TokenResponse | BasicResponse>) => {
  const accessTokenSecond = process.env.ACCESS_TOKEN_SECOND || 3600;
  const refreshTokenSecond = process.env.REFRESH_TOKEN_SECOND || 604800;
  try {
    const payload = req.payload;
    if (!payload) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }
    if (payload.type !== 'refresh') {
      return res.status(400).json({
        message: 'refresh token이 아닙니다'
      });
    }

    const userId = payload.sub;
    if (!userId) {
      return res.status(400).json({
        message: '만료되었거나 확인할 수 없는 토큰'
      });
    }

    const accessToken = await generateToken(userId, crypto.randomUUID(), true);
    const refreshToken = await generateToken(crypto.randomUUID(), userId, false);
    await redis.set(`access ${userId}`, accessToken, 'EX', accessTokenSecond);
    await redis.set(`refresh ${userId}`, refreshToken, 'EX', refreshTokenSecond);

    return res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};

import { Request, Response } from 'express';
import { BasicResponse } from '../../types';
import { TokenResponse } from '../../types/auth';
import { signJWT } from '../../utils/jwt';
import redis from '../../config/redis';

export const generateToken = (id: string, isAccess: boolean) => {
  const token = signJWT(
    {
      id,
      type: isAccess ? 'access' : 'refresh',
      iat: Math.floor(Date.now() / 1000)
    },
    isAccess ? '1h' : '7d'
  );
  return token;
};

export const refresh = async (req: Request, res: Response<TokenResponse | BasicResponse>) => {
  const authorization = req.get('Authorization');
  if (!authorization) {
    return res.status(400).json({
      message: '확인할 수 없는 토큰'
    });
  }
  const token = authorization.split(' ')[1];
  const value = await redis.get(`refresh ${token}`);
  if (!value) {
    return res.status(400).json({
      message: '만료되었거나 확인할 수 없는 토큰'
    });
  }

  const accessToken = await generateToken(value, true);
  await redis.set(value, accessToken, 'EX', 3600);

  return res.status(200).json({
    accessToken: accessToken,
    refreshToken: token
  });
};

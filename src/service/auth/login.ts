import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import bcrypt from 'bcrypt';
import redis from '../../config/redis';
import { TokenResponse, SignRequest } from '../../types/auth';
import { generateToken } from './token';
import crypto from 'crypto';
import { BasicResponse } from '../../types';

export const login = async (req: Request<{}, {}, SignRequest>, res: Response<TokenResponse | BasicResponse>) => {
  try {
    const { email, password } = req.body;

    const thisUser = await prisma.user.findUnique({ where: { email } });
    if (!thisUser) {
      return res.status(404).json({
        message: '존재하지 않는 사용자'
      });
    }
    if (!(await bcrypt.compare(password, thisUser.password))) {
      return res.status(401).json({
        message: '비밀번호 불일치'
      });
    }

    const accessToken = generateToken(thisUser.id.toString(), true);
    const refreshToken = generateToken(crypto.randomUUID(), false);

    await redis.set(thisUser.id.toString(), accessToken, 'EX', 3600);
    await redis.set(`refresh ${refreshToken}`, thisUser.id.toString(), 'EX', 604800);

    return res.status(200).json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 오류 발생'
    });
  }
};

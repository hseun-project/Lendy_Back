import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import { checkMailRegex, checkPasswordRegex } from '../../utils/regex';
import bcrypt from 'bcrypt';
import { SignUpRequest } from '../../types/auth';

export const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: '입력값 없음'
    });
  }
  if (!checkMailRegex(email)) {
    return res.status(400).json({
      message: '이메일 양식 오류'
    });
  }
  if (!checkPasswordRegex(password)) {
    return res.status(400).json({
      message: '비밀번호 양식 오류'
    });
  }
  try {
    const thisMailUser = await prisma.user.findUnique({ where: { email } });
    if (thisMailUser) {
      return res.status(409).json({
        message: '이미 가입된 메일'
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email,
        password: hash
      }
    });

    return res.status(201).json({
      message: '회원가입 성공'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

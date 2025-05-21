import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import crypto from 'crypto';
import { BasicResponse } from '../../types';
import { IdentificationUrlResponse } from '../../types/auth';

const clientId = process.env.OPEN_API_CLIENT_ID;
const redirectionUrl = process.env.OPEN_API_REDIRECTION_URL;
const openApiTestUrl = process.env.OPEN_API_TEST_URL;
if (!clientId || !redirectionUrl || !openApiTestUrl) {
  throw Error('env 변수 불러오기 실패');
}

export const identificationUrl = async (req: Request, res: Response<IdentificationUrlResponse | BasicResponse>) => {
  if (!clientId || !redirectionUrl || !openApiTestUrl) {
    return res.status(500).json({
      message: 'not defined env'
    });
  }
  let state = crypto.randomBytes(16).toString('hex');
  state = BigInt('0x' + state)
    .toString()
    .slice(0, 32)
    .padStart(32, '0');

  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: '사용자를 찾을 수 없습니다'
      });
    }

    await prisma.user.update({
      where: { email },
      data: { state: state }
    });

    const url = `${openApiTestUrl}/oauth/2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectionUrl}&scope=login+inquiry+transfer&state=${state}&auth_type=0`;
    return res.status(200).json({
      url: url
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

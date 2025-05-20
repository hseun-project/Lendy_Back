import axios from 'axios';
import { prisma } from '../../config/prisma';
import redis from '../../config/redis';
import { BankData } from '../../types/open';
import { REDIS_KEY } from '../../types';

export const userInfo = async (code: string) => {
  const testUrl = process.env.OPEN_API_TEST_URL;
  if (!testUrl) {
    throw Error('openApiUrl is not found');
  }
  try {
    const userDetail = await prisma.userDetail.findFirst({ where: { userCode: code } });
    if (!userDetail) {
      throw Error('userDetail is not Found');
    }
    const url = `${testUrl}/v2.0/user/me?user_seq_no=${userDetail?.userSeqNo}`;
    const token = await redis.get(`${REDIS_KEY.OPEN_ACCESS_TOKEN} ${userDetail.id}`);
    if (!token) {
      throw Error('토큰 없음');
    }

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { api_tran_id, user_name, res_cnt, res_list } = res.data;

    await prisma.userDetail.update({
      where: { id: userDetail.id },
      data: {
        apiTranId: api_tran_id,
        userName: user_name
      }
    });

    const resList: BankData[] = res_list;

    await prisma.bank.createMany({
      data: resList.map((b) => ({
        fintechUseNum: b.fintech_use_num,
        userId: userDetail.id,
        bankName: b.bank_name,
        alias: b.account_alias,
        bankNumberMasked: b.account_num_masked,
        ownerName: b.account_holder_type
      })),
      skipDuplicates: true
    });
  } catch (err) {
    throw err;
  }
};

import axios from 'axios';
import { prisma } from '../../config/prisma';
import redis from '../../config/redis';
import { BankData } from '../../types/open';
import { connect } from 'http2';

export const userInfo = async (code: string) => {
  const testUrl = process.env.OPEN_API_TEST_URL;
  if (!testUrl) {
    return;
  }
  try {
    const userDetail = await prisma.userDetail.findFirst({ where: { userCode: code } });
    if (!userDetail) {
      return;
    }
    const url = `${testUrl}/v2.0/user/me?user_seq_no=${userDetail?.userSeqNo}`;
    const token = await redis.get(`openAccess ${userDetail.id}`);

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

    for (const bankData of resList) {
      await prisma.bank.create({
        data: {
          fintechUseNum: bankData.fintech_use_num,
          user: { connect: { id: userDetail.id } },
          bankName: bankData.bank_name,
          alias: bankData.account_alias,
          bankNumberMasked: bankData.account_num_masked,
          ownerName: bankData.account_holder_type
        }
      });
    }
  } catch (err) {
    console.error(err);
    return;
  }
};

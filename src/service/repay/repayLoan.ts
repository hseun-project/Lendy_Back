import { Response } from 'express';
import { AuthenticatedRequest, BasicResponse, REDIS_KEY } from '../../types';
import redis from '../../config/redis';
import { oddToken } from '../open/token';
import axios from 'axios';
import qs from 'qs';
import { prisma } from '../../config/prisma';

export const repayLoan = async (req: AuthenticatedRequest, res: Response<BasicResponse>) => {
  try {
    const loanId = req.params.loanId;
    if (!loanId) {
      return res.status(400).json({
        message: '올바르지 않은 파라미터'
      });
    }
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        message: '토큰 검증 실패'
      });
    }
    const userInfo = await prisma.userDetail.findUnique({ where: { id: userId } });
    if (!userInfo || !userInfo.bankId) {
      return res.status(404).json({
        message: '존재하지 않는 사용자'
      });
    }

    const userBank = await prisma.bank.findUnique({ where: { id: userInfo.bankId } });
    if (!userBank) {
      return res.status(404).json({
        message: '존재하지 않는 사용자 은행 정보'
      });
    }

    const { repayMoney } = req.body;

    let clientUseCode = await redis.get('lendy');
    if (!clientUseCode) {
      oddToken();
      clientUseCode = await redis.get('lendy');
    }
    if (clientUseCode === null) {
      return res.status(404).json({
        message: '기관 토큰을 발급 실패'
      });
    }

    const openApiUrl = process.env.OPEN_API_TEST_URL;

    const bankTranId = await redis.get('lendy bank_tran_id');

    const response = await axios.post(`${openApiUrl}/v2.0/transfet/withdraw/fin_num`, {
      bank_tran_id: bankTranId,
      cntr_account_type: 'N',
      cntr_account_num: '',
      dps_print_content: userInfo.userName,
      fintech_use_num: userBank.fintechUseNum,
      tran_amt: repayMoney,
      req_client_name: userInfo.userName,
      req_client_num: userInfo.id,
      transfet_purpose: 'TR'
    });

    if (response.data.rsp_code !== 'A0000') {
      return res.status(500).json({
        message: `출금 실패 ${response.data.rsp_code}`
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: '서버 에러 발생'
    });
  }
};

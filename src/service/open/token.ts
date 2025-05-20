import { prisma } from '../../config/prisma';
import redis from '../../config/redis';
import axios from 'axios';
import qs from 'qs';

const clientId = process.env.OPEN_API_CLIENT_ID;
const clientSecret = process.env.OPEN_API_SECRET_KEY;
const openApiTestUrl = process.env.OPEN_API_TEST_URL;
const tokenApiUrl = `${openApiTestUrl}/oauth/2.0/token`;

export const userToken = async (userCode: string) => {
  const redirectionUrl = process.env.OPEN_API_REDIRECTION_URL;
  try {
    const res = await axios.post(
      tokenApiUrl,
      qs.stringify({
        code: userCode,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectionUrl,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        }
      }
    );

    const { access_token, refresh_token, expires_in, user_seq_no } = res.data;

    const userDetail = await prisma.userDetail.update({
      where: { userCode: userCode },
      data: { userSeqNo: user_seq_no }
    });

    await redis.set(`openAccess ${userDetail.id}`, access_token, 'EX', expires_in);
    await redis.set(`openRefresh ${userDetail.id}`, refresh_token, 'EX', expires_in + 10000);
  } catch (err) {
    throw Error('userToken failed');
  }
};

export const oddToken = async () => {
  const scope = 'oob';
  const grantType = 'client_credentials';

  try {
    const res = await axios.post(
      tokenApiUrl,
      qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope,
        grant_type: grantType
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        }
      }
    );

    const { access_token, expires_in, client_use_code } = res.data;
    await redis.set('lendy', client_use_code, 'EX', expires_in);
    await redis.set(client_use_code, access_token, 'EX', expires_in);
  } catch (err) {
    throw Error('oddToken Failed');
  }
};

export const refresh = async (refreshToken: string) => {
  try {
    const res = await axios.post(
      tokenApiUrl,
      qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        scope: 'login inquiry transfer',
        grant_type: 'refresh_token'
      })
    );

    const { access_token, refresh_token, expires_in, user_seq_no } = res.data;

    const userDetail = await prisma.userDetail.findUnique({ where: { userSeqNo: user_seq_no } });
    if (!userDetail) {
      throw Error('UserDetail is not Found');
    }

    await redis.set(`openAccess ${userDetail.id}`, access_token, 'EX', expires_in);
    await redis.set(`openRefresh ${userDetail.id}`, refresh_token, 'EX', expires_in + 10000);
  } catch (err) {
    throw Error('refresh Failed');
  }
};

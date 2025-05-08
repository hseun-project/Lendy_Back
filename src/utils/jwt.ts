import jwt from 'jsonwebtoken';
import ms from 'ms';

export const signJWT = (payload: object, expiresIn: ms.StringValue): string => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('private key is not defined');
  }
  return jwt.sign(payload, privateKey, { algorithm: 'HS256', expiresIn: expiresIn });
};

export const verifyJWT = (token: string) => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return {
        payload: null,
        expired: 'private key is not defined'
      };
    }
    const decoded = jwt.verify(token, privateKey);
    return {
      payload: decoded,
      expired: false
    };
  } catch (err: any) {
    console.error(err);
    return {
      payload: null,
      expired: err.message.includes('jwt expired')
    };
  }
};

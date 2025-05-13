import jwt from 'jsonwebtoken';
import ms from 'ms';

export const signJWT = (payload: object, expiresIn: ms.StringValue): string => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('private key is not defined');
  }
  return jwt.sign(payload, privateKey, { algorithm: 'HS256', expiresIn: expiresIn });
};

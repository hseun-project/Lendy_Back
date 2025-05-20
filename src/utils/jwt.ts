import jwt from 'jsonwebtoken';
import ms from 'ms';

const signJWT = (payload: object, expiresIn: ms.StringValue): string => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('private key is not defined');
  }
  return jwt.sign(payload, privateKey, { algorithm: 'HS256', expiresIn: expiresIn });
};

export const generateToken = (id: string, sub: string, isAccess: boolean) => {
  const token = signJWT(
    {
      id,
      sub,
      type: isAccess ? 'access' : 'refresh',
      iat: Math.floor(Date.now() / 1000)
    },
    isAccess ? '1h' : '7d'
  );
  return token;
};

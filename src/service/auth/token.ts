import { signJWT } from '../../utils/jwt';

export const generateToken = (id: string, isAccess: boolean) => {
  const token = signJWT(
    {
      id,
      type: isAccess ? 'access' : 'refresh',
      iat: Math.floor(Date.now() / 1000)
    },
    isAccess ? '1h' : '7d'
  );
  return token;
};

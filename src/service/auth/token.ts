import { signJWT } from '../../utils/jwt';

export const generateToken = async (id: string, isAccess: boolean) => {
  const token = signJWT({ id }, isAccess ? '1h' : '7d');
  return token;
};

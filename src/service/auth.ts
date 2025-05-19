import { signUp } from './auth/signup';
import { login } from './auth/login';
import { refresh } from './auth/token';
import { logout } from './auth/logout';
import { identificationUrl } from './auth/identificationUrl';

export default {
  signUp,
  login,
  refresh,
  logout,
  identificationUrl
};

export interface BasicResponse {
  message: string;
}

export const REDIS_KEY = {
  ACCESS_TOKEN: 'access',
  REFRESH_TOKEN: 'refresh',
  OPEN_ACCESS_TOKEN: 'openAccess',
  OPEN_REFRESH_TOKEN: 'openRefresh'
};

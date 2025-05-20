import { Request } from 'express';
import { JwtPayloadData } from './auth';
import { ParsedQs } from 'qs';

export interface BasicResponse {
  message: string;
}

export interface AuthenticatedRequest<Params = Record<string, never>, Query = ParsedQs, Body = Record<string, never>>
  extends Request<Params, any, Body, Query> {
  payload?: JwtPayloadData;
}

export const REDIS_KEY = {
  ACCESS_TOKEN: 'access',
  REFRESH_TOKEN: 'refresh',
  OPEN_ACCESS_TOKEN: 'openAccess',
  OPEN_REFRESH_TOKEN: 'openRefresh'
};

import { Request } from 'express';

export interface SignRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedRequest extends Request {
  payload?: JwtPayloadData;
}

export interface JwtPayloadData {
  id: string;
  type: 'access' | 'refresh';
  iat: number;
}

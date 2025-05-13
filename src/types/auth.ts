import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

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

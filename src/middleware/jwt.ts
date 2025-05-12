import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  payload?: string | JwtPayload;
}

export const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      res.status(500).json({
        message: 'private key is not defined'
      });
      return;
    }
    const authorization = req.get('Authorization');
    if (!authorization) {
      res.status(401).json({
        message: '토큰 유효성 검사 실패'
      });
      return;
    }
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, privateKey);
    req.payload = decoded;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: '토큰 검증 오류 발생'
    });
  }
};

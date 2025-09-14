import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User.js';

interface JwtPayload {
  userId: string;
  email: string;
}

interface AuthRequest extends Request {
  user?: IUser;
}

// Generate JWT token
export const generateToken = (userId: string, email: string): string => {
  const payload: JwtPayload = { userId, email };
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

// Verify JWT token
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  return jwt.verify(token, secret) as JwtPayload;
};

// Middleware to authenticate requests
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
      return;
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Token verification failed'
      });
    }
  }
};

// Generate password reset token
export const generateResetToken = (): string => {
  return jwt.sign(
    { purpose: 'password-reset', timestamp: Date.now() },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: '1h' }
  );
};

// Verify password reset token
export const verifyResetToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-key'
    ) as any;
    return decoded.purpose === 'password-reset';
  } catch (error) {
    return false;
  }
};

export type { AuthRequest };
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Student } from '../models/Student.js';

interface JwtPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is missing' });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Verify user exists and is not deleted
    const student = await Student.findById(decoded.id);
    if (!student || student.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Account no longer exists. Please login again.',
      });
    }

    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

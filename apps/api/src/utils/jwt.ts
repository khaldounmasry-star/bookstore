import jwt, { type JwtPayload, type SignOptions, type Secret } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { logger } from '@utils/logger';

interface TokenPayload {
  id: number;
  role: Role;
  email: string;
}

const JWT_SECRET: Secret = process.env['JWT_SECRET'] ?? '';
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export function signToken(
  payload: TokenPayload,
  expiresIn: SignOptions['expiresIn'] = WEEK_IN_SECONDS
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken<T extends object = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch(e) {
    logger.error('JWT verification error:', (e as Error).message);

    return null;
  }
}

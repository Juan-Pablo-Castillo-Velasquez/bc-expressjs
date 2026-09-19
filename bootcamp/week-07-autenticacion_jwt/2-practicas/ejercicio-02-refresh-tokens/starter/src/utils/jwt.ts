// ============================================
// PASO 2: Utilidades de JWT — Access + Refresh
// ============================================

import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// ── Access Token ──────────────────────────────────────────────────────────────
export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m',
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
}

// ── Refresh Token (PASO 2) ────────────────────────────────────────────────────
// El refresh token usa un SECRETO DIFERENTE al access token
export function signRefreshToken(payload: Pick<JwtPayload, 'sub'>): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
}

export function verifyRefreshToken(token: string): Pick<JwtPayload, 'sub'> {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as Pick<JwtPayload, 'sub'>;
}

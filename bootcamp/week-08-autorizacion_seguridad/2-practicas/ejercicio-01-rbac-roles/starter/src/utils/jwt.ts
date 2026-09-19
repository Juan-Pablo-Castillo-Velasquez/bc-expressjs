import jwt from 'jsonwebtoken';

// ============================================
// JWT PAYLOAD INTERFACE
// ============================================

export interface JwtPayload {
  sub: string;
  email: string;
  // El role viaja en el token para que requireRole() pueda
  // verificarlo SIN consultar la base de datos en cada request.
  role: string;
}

// ============================================
// ACCESS TOKEN
// ============================================

export function signAccessToken(payload: JwtPayload): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';

  if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not defined');

  return jwt.verify(token, secret) as JwtPayload;
}

// ============================================
// REFRESH TOKEN
// ============================================

export function signRefreshToken(userId: string): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');

  return jwt.sign({ sub: userId }, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): { sub: string } {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');

  return jwt.verify(token, secret) as { sub: string };
}

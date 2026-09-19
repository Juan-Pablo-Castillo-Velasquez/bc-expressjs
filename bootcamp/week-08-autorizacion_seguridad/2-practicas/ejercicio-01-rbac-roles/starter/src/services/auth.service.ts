import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateRefreshToken,
} from '../repositories/users.repository.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema.js';

export async function register(dto: RegisterDto) {
  const existing = await findUserByEmail(dto.email);
  if (existing) throw new AppError(409, 'Email already registered');

  const hashed = await bcrypt.hash(dto.password, 12);
  const user = await createUser({ ...dto, password: hashed });

  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function login(dto: LoginDto) {
  const user = await findUserByEmail(dto.email);
  if (!user) throw new AppError(401, 'Invalid credentials');

  const valid = await bcrypt.compare(dto.password, user.password);
  if (!valid) throw new AppError(401, 'Invalid credentials');

  // ============================================
  // PASO 3: Incluye el role en el payload del access token
  // ============================================
  // El role permite que requireRole() verifique permisos
  // sin consultar la base de datos en cada request.
  // Descomenta la propiedad role en el objeto de abajo:
  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = signRefreshToken(user._id.toString());
  await updateRefreshToken(user._id.toString(), refreshToken);

  return { accessToken, refreshToken, role: user.role };
}

export async function refreshTokens(token: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const user = await findUserById(payload.sub);
  if (!user) throw new AppError(401, 'User not found');

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const newRefreshToken = signRefreshToken(user._id.toString());
  await updateRefreshToken(user._id.toString(), newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string) {
  await updateRefreshToken(userId, null);
}

export async function getMe(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, 'User not found');
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

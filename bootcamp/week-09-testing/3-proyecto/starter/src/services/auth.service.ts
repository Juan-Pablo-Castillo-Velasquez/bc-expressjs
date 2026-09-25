import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError.js';
import type { LoginDto, RegisterDto } from '../types/index.js';
import * as usersRepo from '../repositories/users.repository.js';
import { signAccessToken } from '../utils/jwt.js';

const BCRYPT_ROUNDS = 12;

export async function register(dto: RegisterDto): Promise<Record<string, unknown>> {
  const existing = await usersRepo.findUserByEmail(dto.email);
  if (existing) throw new AppError(409, 'Email already registered');

  const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
  const user = await usersRepo.createUser({ ...dto, password: hashedPassword, role: 'user' });

  const { password: _p, ...safeUser } = user as unknown as Record<string, unknown>;
  return safeUser;
}

export async function login(dto: LoginDto): Promise<{ accessToken: string }> {
  const user = await usersRepo.findUserByEmail(dto.email);
  if (!user) throw new AppError(401, 'Invalid credentials');

  const match = await bcrypt.compare(dto.password, user.password);
  if (!match) throw new AppError(401, 'Invalid credentials');

  const accessToken = signAccessToken({
    sub: (user._id as unknown as string).toString(),
    role: user.role,
  });
  return { accessToken };
}

export async function getMe(userId: string): Promise<Record<string, unknown>> {
  const user = await usersRepo.findUserById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { password: _p, ...safeUser } = user as unknown as Record<string, unknown>;
  return safeUser;
}

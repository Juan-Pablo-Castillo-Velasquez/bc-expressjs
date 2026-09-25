// ============================================================
// UNIT TESTS — auth.service.ts
// ============================================================
// Reutiliza los tests del Ejercicio 01, adaptados a este proyecto
// (dominio Radio Comunitaria). La capa de repositorio se MOCKEA —
// nunca toca una DB real.
//
// Patrón:
//   Arrange → configurar mocks y datos de prueba
//   Act     → llamar la función que se testea
//   Assert  → verificar el resultado o el error
// ============================================================

import bcrypt from 'bcrypt';

jest.mock('../repositories/users.repository');

import * as usersRepo from '../repositories/users.repository';
import * as authService from '../services/auth.service';
import type { IUser } from '../models/user.model';

const mockFindByEmail = usersRepo.findUserByEmail as jest.MockedFunction<typeof usersRepo.findUserByEmail>;
const mockCreateUser = usersRepo.createUser as jest.MockedFunction<typeof usersRepo.createUser>;

const userBase = {
  _id: 'user-id-abc123',
  name: 'Alice',
  email: 'alice@test.com',
  role: 'user' as const,
  createdAt: new Date('2025-01-01'),
};

const registerDto = {
  name: 'Alice',
  email: 'alice@test.com',
  password: 'Password1!',
};

const loginDto = {
  email: 'alice@test.com',
  password: 'Password1!',
};

describe('Auth Service — Unit Tests', () => {
  it('should have mocked repository functions', () => {
    expect(jest.isMockFunction(usersRepo.findUserByEmail)).toBe(true);
    expect(jest.isMockFunction(usersRepo.createUser)).toBe(true);
  });

  describe('register()', () => {
    it('should create a user and return it without the password', async () => {
      // Arrange
      mockFindByEmail.mockResolvedValue(null);
      const hashedPwd = await bcrypt.hash(registerDto.password, 1);
      mockCreateUser.mockResolvedValue({ ...userBase, password: hashedPwd } as unknown as IUser);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(result['email']).toBe(registerDto.email);
      expect(result['name']).toBe(registerDto.name);
      expect(result['role']).toBe('user');
      expect(result['password']).toBeUndefined();
    });

    it('should throw AppError 409 if email already exists', async () => {
      // Arrange
      mockFindByEmail.mockResolvedValue({ ...userBase, password: 'hashed-password' } as unknown as IUser);

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Email already registered',
      });
      expect(mockCreateUser).not.toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    it('should throw AppError 401 when user is not found', async () => {
      // Arrange
      mockFindByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw AppError 401 when password is wrong', async () => {
      // Arrange
      const realHash = await bcrypt.hash('OtraContrasena1!', 1);
      mockFindByEmail.mockResolvedValue({ ...userBase, password: realHash } as unknown as IUser);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should return accessToken on valid credentials', async () => {
      // Arrange
      const correctHash = await bcrypt.hash(loginDto.password, 1);
      mockFindByEmail.mockResolvedValue({ ...userBase, password: correctHash } as unknown as IUser);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
    });

    it('should call findByEmail with the correct email', async () => {
      // Arrange
      mockFindByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toBeDefined();
      expect(mockFindByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockFindByEmail).toHaveBeenCalledTimes(1);
    });
  });
});

export {};

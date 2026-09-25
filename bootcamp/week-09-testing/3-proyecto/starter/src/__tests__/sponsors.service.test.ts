// ============================================================
// UNIT TESTS — sponsors.service.ts
// ============================================================
// Dominio: Radio Comunitaria — Sponsor (patrocinador)
// El repositorio se mockea por completo: estos tests verifican
// SOLO la lógica de negocio de la capa de servicio (autorización,
// validación de duplicados, propagación de errores 404/403/409).
// ============================================================

jest.mock('../repositories/sponsors.repository');

import * as sponsorsRepo from '../repositories/sponsors.repository';
import * as sponsorsService from '../services/sponsors.service';
import { AppError } from '../errors/AppError';
import type { ISponsor } from '../models/sponsor.model';

const mockFindAll = sponsorsRepo.findAllSponsors as jest.MockedFunction<typeof sponsorsRepo.findAllSponsors>;
const mockFindById = sponsorsRepo.findSponsorById as jest.MockedFunction<typeof sponsorsRepo.findSponsorById>;
const mockFindByEmail = sponsorsRepo.findSponsorByEmail as jest.MockedFunction<typeof sponsorsRepo.findSponsorByEmail>;
const mockCreate = sponsorsRepo.createSponsor as jest.MockedFunction<typeof sponsorsRepo.createSponsor>;
const mockUpdate = sponsorsRepo.updateSponsor as jest.MockedFunction<typeof sponsorsRepo.updateSponsor>;
const mockDelete = sponsorsRepo.deleteSponsor as jest.MockedFunction<typeof sponsorsRepo.deleteSponsor>;

const sponsorBase = {
  _id: 'sponsor-id-123',
  name: 'Radio Amigos del Barrio S.A.S.',
  contactEmail: 'contacto@amigosdelbarrio.com',
  contactPhone: '3001234567',
  contributionAmount: 500000,
  status: 'active',
  createdBy: 'user-id-abc',
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as ISponsor;

describe('SponsorsService — Unit Tests', () => {
  describe('getAll()', () => {
    it('should return an empty array when there are no sponsors', async () => {
      // Arrange
      mockFindAll.mockResolvedValue([]);

      // Act
      const result = await sponsorsService.getAll();

      // Assert
      expect(result).toEqual([]);
      expect(mockFindAll).toHaveBeenCalledWith(undefined);
    });

    it('should return the list of sponsors when they exist', async () => {
      // Arrange
      mockFindAll.mockResolvedValue([sponsorBase]);

      // Act
      const result = await sponsorsService.getAll();

      // Assert
      expect(result).toEqual([sponsorBase]);
      expect(result).toHaveLength(1);
    });
  });

  describe('getById()', () => {
    it('should return the sponsor when it exists', async () => {
      // Arrange
      mockFindById.mockResolvedValue(sponsorBase);

      // Act
      const result = await sponsorsService.getById('sponsor-id-123');

      // Assert
      expect(result).toEqual(sponsorBase);
      expect(mockFindById).toHaveBeenCalledWith('sponsor-id-123');
    });

    it('should throw AppError 404 when the sponsor does not exist', async () => {
      // Arrange
      mockFindById.mockResolvedValue(null);

      // Act & Assert
      await expect(sponsorsService.getById('missing-id')).rejects.toThrow(AppError);
      await expect(sponsorsService.getById('missing-id')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('create()', () => {
    it('should create the sponsor when the email is not duplicated', async () => {
      // Arrange
      mockFindByEmail.mockResolvedValue(null);
      mockCreate.mockResolvedValue(sponsorBase);

      // Act
      const result = await sponsorsService.create(
        { name: sponsorBase.name, contactEmail: sponsorBase.contactEmail },
        'user-id-abc',
      );

      // Assert
      expect(result).toEqual(sponsorBase);
      expect(mockCreate).toHaveBeenCalledWith(
        { name: sponsorBase.name, contactEmail: sponsorBase.contactEmail },
        'user-id-abc',
      );
    });

    it('should throw AppError 409 when the contact email is already registered', async () => {
      // Arrange
      mockFindByEmail.mockResolvedValue(sponsorBase);

      // Act & Assert
      await expect(
        sponsorsService.create({ name: 'Otro', contactEmail: sponsorBase.contactEmail }, 'user-id-abc'),
      ).rejects.toMatchObject({ statusCode: 409 });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should update the sponsor when the requester is the owner', async () => {
      // Arrange
      mockFindById.mockResolvedValue(sponsorBase);
      mockUpdate.mockResolvedValue({ ...sponsorBase, name: 'Nuevo nombre' } as ISponsor);

      // Act
      const result = await sponsorsService.update(
        'sponsor-id-123',
        { name: 'Nuevo nombre' },
        'user-id-abc',
        'user',
      );

      // Assert
      expect(result.name).toBe('Nuevo nombre');
    });

    it('should throw AppError 403 when the requester is neither owner nor admin', async () => {
      // Arrange
      mockFindById.mockResolvedValue(sponsorBase);

      // Act & Assert
      await expect(
        sponsorsService.update('sponsor-id-123', { name: 'X' }, 'another-user-id', 'user'),
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should allow update when the requester is an admin (even without being the owner)', async () => {
      // Arrange
      mockFindById.mockResolvedValue(sponsorBase);
      mockUpdate.mockResolvedValue({ ...sponsorBase, status: 'inactive' } as ISponsor);

      // Act
      const result = await sponsorsService.update(
        'sponsor-id-123',
        { status: 'inactive' },
        'another-user-id',
        'admin',
      );

      // Assert
      expect(result.status).toBe('inactive');
    });

    it('should throw AppError 404 when the sponsor does not exist', async () => {
      // Arrange
      mockFindById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        sponsorsService.update('missing-id', { name: 'X' }, 'user-id-abc', 'user'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('remove()', () => {
    it('should delete the sponsor when the requester is an admin', async () => {
      // Arrange
      mockFindById.mockResolvedValue(sponsorBase);
      mockDelete.mockResolvedValue(sponsorBase);

      // Act
      await sponsorsService.remove('sponsor-id-123', 'another-user-id', 'admin');

      // Assert
      expect(mockDelete).toHaveBeenCalledWith('sponsor-id-123');
    });

    it('should throw AppError 403 when the requester is neither owner nor admin', async () => {
      // Arrange
      mockFindById.mockResolvedValue(sponsorBase);

      // Act & Assert
      await expect(
        sponsorsService.remove('sponsor-id-123', 'another-user-id', 'user'),
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when the sponsor does not exist', async () => {
      // Arrange
      mockFindById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        sponsorsService.remove('missing-id', 'user-id-abc', 'user'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});

export {};

// ============================================================
// INTEGRATION TESTS — sponsors routes
// ============================================================
// Dominio: Radio Comunitaria — Sponsor (patrocinador)
// Ciclo completo HTTP → controller → service → DB (Mongo en memoria).
//
// Se generan tres identidades:
//   - ownerToken:    creó el sponsor de prueba
//   - strangerToken: usuario distinto, sin permisos sobre ese sponsor
//   - adminToken:    rol admin, puede modificar/eliminar cualquier sponsor
//
// No existe un endpoint HTTP para crear administradores, así que el
// usuario admin se crea directamente en la base de datos con el modelo
// de Mongoose y se firma su token con signAccessToken().
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';
import { UserModel } from '../models/user.model';
import { signAccessToken } from '../utils/jwt';

let mongod: MongoMemoryServer;

let ownerToken: string;
let strangerToken: string;
let adminToken: string;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

async function registerAndLogin(email: string, name: string): Promise<string> {
  await request(app).post('/api/v1/auth/register').send({ name, email, password: 'Password1!' });
  const loginRes = await request(app).post('/api/v1/auth/login').send({ email, password: 'Password1!' });
  return loginRes.body.accessToken as string;
}

beforeEach(async () => {
  ownerToken = await registerAndLogin('owner@radio.com', 'Owner');
  strangerToken = await registerAndLogin('stranger@radio.com', 'Stranger');

  const admin = await UserModel.create({
    name: 'Admin',
    email: 'admin@radio.com',
    password: 'irrelevant-hash',
    role: 'admin',
  });
  adminToken = signAccessToken({ sub: (admin._id as unknown as string).toString(), role: 'admin' });
});

describe('Sponsors Routes — Integration Tests', () => {
  describe('GET /api/v1/sponsors', () => {
    it('should return an empty list initially', async () => {
      const res = await request(app).get('/api/v1/sponsors');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('POST /api/v1/sponsors', () => {
    it('should return 201 when creating a sponsor with a valid token', async () => {
      const res = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com', status: 'active' });
    });

    it('should return 401 without a token', async () => {
      const res = await request(app)
        .post('/api/v1/sponsors')
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      expect(res.status).toBe(401);
    });

    it('should return 422 on invalid input', async () => {
      const res = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'A', contactEmail: 'not-an-email' });

      expect(res.status).toBe(422);
    });

    it('should return 409 when the contact email is already registered', async () => {
      await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      const res = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${strangerToken}`)
        .send({ name: 'Otro Sponsor', contactEmail: 'contacto@amigos.com' });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/v1/sponsors/:id', () => {
    it('should return 200 with the sponsor data', async () => {
      const createRes = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      const res = await request(app).get(`/api/v1/sponsors/${createRes.body.data._id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Radio Amigos');
    });

    it('should return 404 when the sponsor does not exist', async () => {
      const res = await request(app).get('/api/v1/sponsors/64b64b64b64b64b64b64b64b');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/sponsors/:id', () => {
    it('should return 200 when the owner updates their own sponsor', async () => {
      const createRes = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      const res = await request(app)
        .put(`/api/v1/sponsors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos Actualizado' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Radio Amigos Actualizado');
    });

    it('should return 403 when a non-owner, non-admin user tries to update', async () => {
      const createRes = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      const res = await request(app)
        .put(`/api/v1/sponsors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${strangerToken}`)
        .send({ name: 'Intento no autorizado' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/sponsors/:id', () => {
    it('should return 204 when the owner deletes their own sponsor', async () => {
      const createRes = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      const res = await request(app)
        .delete(`/api/v1/sponsors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(204);
    });

    it('should return 204 when an admin deletes a sponsor they do not own', async () => {
      const createRes = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      const res = await request(app)
        .delete(`/api/v1/sponsors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });

    it('should return 403 when a non-owner, non-admin user tries to delete', async () => {
      const createRes = await request(app)
        .post('/api/v1/sponsors')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Radio Amigos', contactEmail: 'contacto@amigos.com' });

      const res = await request(app)
        .delete(`/api/v1/sponsors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${strangerToken}`);

      expect(res.status).toBe(403);
    });
  });
});

export {};

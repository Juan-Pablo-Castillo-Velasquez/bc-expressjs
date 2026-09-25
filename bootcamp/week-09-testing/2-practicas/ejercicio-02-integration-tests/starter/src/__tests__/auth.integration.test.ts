// ============================================================
// INTEGRATION TESTS — auth routes
// ============================================================
// Objetivo: testear el ciclo completo HTTP → controller → service → DB
// SIN mocks de la capa de servicio. La DB es MongoDB en memoria.
//
// Patrón de setup:
//   beforeAll  → crear MongoMemoryServer + conectar mongoose
//   afterEach  → limpiar colecciones (estado limpio entre tests)
//   afterAll   → desconectar mongoose + detener servidor
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';

import { MongoMemoryServer } from 'mongodb-memory-server';

// ============================================================
// PASO 1: Configurar mongodb-memory-server
// ============================================================
let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Crear una instancia de MongoDB en RAM
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  // Conectar mongoose a la instancia en memoria
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Limpiar todos los documentos después de cada test
  // Esto garantiza que cada test parte de una DB vacía
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // Desconectar y liberar recursos
  await mongoose.disconnect();
  await mongod.stop();
});

// ============================================================
// PASO 2: POST /api/v1/auth/register → 201
// ============================================================
describe('Auth Routes — Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return 201 and user data on valid registration', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Alice',
          email: 'alice@test.com',
          password: 'Password1!',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        email: 'alice@test.com',
        name: 'Alice',
        role: 'user',
      });
      // La contraseña NUNCA debe aparecer en la respuesta
      expect(res.body.data.password).toBeUndefined();
    });

    it('should return 422 on invalid input', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'A', email: 'not-an-email', password: '123' });

      expect(res.status).toBe(422);
    });

    // ============================================================
    // PASO 3: POST /api/v1/auth/register → 409 (duplicado)
    // ============================================================
    it('should return 409 when email is already registered', async () => {
      // Registrar el primer usuario
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Alice', email: 'alice@test.com', password: 'Password1!' });

      // Intentar registrar con el mismo email
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Alice Duplicada', email: 'alice@test.com', password: 'Password1!' });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('Email already registered');
    });
  });

  // ============================================================
  // PASO 4: POST /api/v1/auth/login → 200 con token
  //         GET  /api/v1/auth/me    → 200 usando el token
  // ============================================================
  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Crear un usuario antes de cada test de login
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Alice', email: 'alice@test.com', password: 'Password1!' });
    });

    it('should return 200 and accessToken on valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'alice@test.com', password: 'Password1!' });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(typeof res.body.accessToken).toBe('string');
    });

    it('should return 401 on wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'alice@test.com', password: 'WrongPassword1!' });

      expect(res.status).toBe(401);
    });

    it('should use token to access GET /auth/me', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'alice@test.com', password: 'Password1!' });

      const token = loginRes.body.accessToken as string;

      const meRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meRes.status).toBe(200);
      expect(meRes.body.data.email).toBe('alice@test.com');
    });

    it('should return 401 on GET /auth/me without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });
});

// Este export vacío es necesario para que TypeScript
// trate el archivo como un módulo
export {};

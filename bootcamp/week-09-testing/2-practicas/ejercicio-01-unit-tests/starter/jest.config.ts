import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  // El código fuente usa imports relativos con extensión .js (estilo ESM,
  // p.ej. '../errors/AppError.js') aunque el archivo real es .ts. tsc lo
  // resuelve bien, pero el resolver de módulos de Jest no — sin este mapeo
  // busca un AppError.js compilado que no existe y el test suite ni arranca.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  clearMocks: true,
  // Este ejercicio testea únicamente auth.service.ts (el repositorio está
  // SIEMPRE mockeado por diseño — su cuerpo real nunca se ejecuta aquí, y
  // utils/jwt.ts es una capa delgada sobre `jsonwebtoken` que no es el
  // objetivo de este ejercicio). Medir cobertura sobre src/**/*.ts completo
  // hacía que el umbral global de "functions" fuera matemáticamente
  // imposible de cumplir sin importar cuántos tests se agreguen, aunque
  // auth.service.ts (el criterio de éxito real de este ejercicio) ya
  // tuviera 100% de cobertura.
  collectCoverageFrom: [
    'src/services/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;

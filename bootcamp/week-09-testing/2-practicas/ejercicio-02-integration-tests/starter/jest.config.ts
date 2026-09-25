import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  // mongodb-memory-server puede tardar en arrancar
  testTimeout: 30000,
  // El codigo fuente usa imports relativos con extension .js (estilo ESM)
  // aunque el archivo real es .ts. Sin este mapeo, el resolver de Jest
  // busca un .js compilado que no existe y el test suite ni arranca.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/types/**',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 75,
      lines: 70,
    },
  },
};

export default config;

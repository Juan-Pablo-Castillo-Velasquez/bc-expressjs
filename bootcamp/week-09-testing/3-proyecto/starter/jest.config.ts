import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
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
    '!src/server.ts',
    '!src/types/**',
    '!src/**/*.d.ts',
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

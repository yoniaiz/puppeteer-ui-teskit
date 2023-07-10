/** @returns {Promise<import('jest').Config>} */
export default {
  testEnvironment: 'node',
  resolver: 'jest-ts-webcompat-resolver',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/*.spec.ts'],
  setupFiles: ['./src/test/setup-jest.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
};

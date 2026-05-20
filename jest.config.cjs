module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/server/src/**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts','js','json','node'],
  globals: {
    'ts-jest': {
      tsconfig: 'server/tsconfig.json'
    }
  }
};

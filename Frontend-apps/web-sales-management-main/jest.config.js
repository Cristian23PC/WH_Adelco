const nextJest = require('next/jest');

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom'
};

const createJestConfig = nextJest({
  dir: './'
})(customJestConfig);

module.exports = async () => {
  const jestConfig = await createJestConfig();

  const moduleNameMapper = {
    ...jestConfig.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1'
  };

  return { ...jestConfig, moduleNameMapper };
};

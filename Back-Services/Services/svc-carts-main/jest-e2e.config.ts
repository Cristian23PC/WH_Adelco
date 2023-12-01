import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePathIgnorePatterns: [
    '<rootDir>/config/*',
    '<rootDir>/build',
    '.*__mocks__.*',
  ],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  modulePaths: [
    'src'
  ],
  moduleNameMapper: {
    '^@/nest-commercetools(|/.*)$': '<rootDir>/libs/nest-commercetools/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@processors/(.*)$': '<rootDir>/src/processors/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@swagger/(.*)$': '<rootDir>/src/swagger/$1'
  },
  testTimeout: 15000
}

export default config;

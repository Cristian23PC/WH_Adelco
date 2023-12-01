import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: ['.*\\.spec\\.ts$', '.*\\.e2e-spec\\.ts$'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePaths: [
    'src'
  ],
  moduleNameMapper: {
    '^@/nest-commercetools(|/.*)$': '<rootDir>/libs/nest-commercetools/src/$1',
    '^@/price-calculation(|/.*)$': '<rootDir>/libs/price-calculation/src/$1',
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
  collectCoverageFrom: ['**/*.(t|j)s'],
  modulePathIgnorePatterns: ['<rootDir>/config/*'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    './src/main.ts',
    './src/module-aliases.ts',
    '.*\\.module\\.ts$',
    '.*\\.config\\.ts$',
    '.*\\.dto\\.ts$',
    '.*\\.enum\\.ts$',
    '.*\\.entity\\.ts$',
    '.*\\.interface\\.ts$',
    '.*\\.error\\.ts$',
    'index\\.ts$',
    'models\\.ts$',
    './src/common/constants/.*',
    'constants.ts',
  ],
  roots: [
    '<rootDir>/src/',
    '<rootDir>/libs/'
  ]
};

export default config;
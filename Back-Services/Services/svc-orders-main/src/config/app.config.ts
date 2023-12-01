import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.ENVIRONMENT ?? 'development',
  projectName: process.env.PROJECT_NAME ?? 'orders',
  rootPath: process.env.ROOT_PATH ?? '/',
  swaggerEnv: process.env.SWAGGER_ENV ?? '/',
  port: process.env.APP_PORT ? Number.parseInt(process.env.APP_PORT) : 9376
}));

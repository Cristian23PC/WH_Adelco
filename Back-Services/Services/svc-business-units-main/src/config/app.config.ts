import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.ENVIRONMENT ?? 'dev',
  projectName: process.env.PROJECT_NAME ?? 'svc-business-units',
  rootPath: process.env.ROOT_PATH ?? '/',
  swaggerEnv: process.env.SWAGGER_ENV ?? '/',
  port: process.env.APP_PORT ? Number.parseInt(process.env.APP_PORT) : 9376
}));

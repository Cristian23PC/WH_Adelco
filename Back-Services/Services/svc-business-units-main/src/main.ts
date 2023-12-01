/* eslint-disable @typescript-eslint/no-unsafe-call */
import './module-aliases';
import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { setupSwagger } from '@/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { TrimStringsPipe } from '@/common/transformer/trim-strings.pipe';
import { AppModule } from '@/main/app.module';
import { CommercetoolsExceptionFilter } from './common/filters/commercetools.exception.filter';
import { ApiErrorFilter } from './common/filters/api.exception.filter';

/**
 * This method initialize configuration setup
 */
const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const rootPath = configService.get<string>('app.rootPath');
  const appPort = configService.get<number>('app.port');
  const swaggerEnv = configService.get<string>('app.swaggerEnv');
  const projectName = configService.get<string>('app.projectName');
  const rootPathUrl = `${rootPath && rootPath !== '/' ? '/' + rootPath + '/' : rootPath}`;

  app.enableCors();
  app.useLogger(app.get(PinoLogger));
  app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new CommercetoolsExceptionFilter());
  app.useGlobalFilters(new ApiErrorFilter());
  app.enableShutdownHooks();
  app.setGlobalPrefix(rootPath);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  setupSwagger(app, rootPathUrl, swaggerEnv);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(appPort, () => {
    Logger.log(`👍 server started at http://localhost:${appPort}`, projectName);
    Logger.log(`✅ http://localhost:${appPort}${rootPathUrl}v1/health/ready`, projectName);
    Logger.log(`✅ http://localhost:${appPort}${rootPathUrl}v1/health/live`, projectName);
    Logger.log(`📖 Swagger Docs: http://localhost:${appPort}${rootPathUrl}api/docs`, projectName);
  });
};

/**
 * Run app
 */
void bootstrap();

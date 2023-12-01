/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SWAGGER_API_CURRENT_VERSION, SWAGGER_API_DESCRIPTION, SWAGGER_API_NAME, SWAGGER_API_ROOT } from '@/common/constants/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerTags } from './swaggerTags';

export const setupSwagger = (app: INestApplication, rootPath: string, swaggerEnv: string) => {
  let options = new DocumentBuilder().setTitle(SWAGGER_API_NAME).setDescription(SWAGGER_API_DESCRIPTION).setVersion(SWAGGER_API_CURRENT_VERSION);

  if (!swaggerEnv || swaggerEnv !== '/') {
    options = options.addServer(`/${swaggerEnv}`);
  }

  const swaggerBuilder = options.addBearerAuth();

  swaggerTags.forEach(({ name, description }) => {
    swaggerBuilder.addTag(name, description);
  });

  const swaggerBuilt = swaggerBuilder.build();

  const document = SwaggerModule.createDocument(app, swaggerBuilt);
  SwaggerModule.setup(`${rootPath}${SWAGGER_API_ROOT}`, app, document);
};

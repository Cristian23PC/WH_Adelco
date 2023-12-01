import { Module } from '@nestjs/common';

import { NestCommercetoolsModule } from '@/nest-commercetools';
import { CategoriesRepository } from 'commercetools-sdk-repositories';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesTreeService } from './categories-tree.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CategoriesRepository]), CacheModule.register()],
  providers: [CategoriesService, CategoriesTreeService],
  controllers: [CategoriesController],
  exports: [CategoriesService]
})
export class CategoriesModule {}

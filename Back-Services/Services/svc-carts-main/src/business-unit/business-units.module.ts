import { Module } from '@nestjs/common';
import { BusinessUnitsService } from './business-units.service';
import { ConfigModule } from '@nestjs/config';
import businessUnitsConfig from './config/business-units.config';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { NestCommercetoolsModule } from '@/nest-commercetools';

@Module({
  imports: [ConfigModule.forFeature(businessUnitsConfig), NestCommercetoolsModule.forFeature([BusinessUnitsRepository])],
  providers: [BusinessUnitsService],
  exports: [BusinessUnitsService]
})
export class BusinessUnitsModule {}

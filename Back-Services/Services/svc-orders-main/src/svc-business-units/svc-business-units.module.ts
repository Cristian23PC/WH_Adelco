import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import svcBusinessUnitsConfig from './config/svc-business-units.config';
import { SvcBusinessUnitsService } from './svc-business-units.service';

@Module({
  imports: [ConfigModule.forFeature(svcBusinessUnitsConfig)],
  providers: [SvcBusinessUnitsService],
  exports: [SvcBusinessUnitsService]
})
export class SvcBusinessUnitsModule {}

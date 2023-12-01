import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RutService } from './rut.service';
import rutConfig from './config/rut.config';

@Module({
  imports: [ConfigModule.forFeature(rutConfig)],
  providers: [RutService],
  exports: [RutService]
})
export class RutModule {}

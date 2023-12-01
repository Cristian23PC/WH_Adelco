import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import svcCartsConfig from './config/svc-carts.config';
import { SvcCartsService } from './svc-carts.service';
import { DeliveryZonesModule } from '@/delivery-zones/delivery-zones.module';

@Module({
  imports: [ConfigModule.forFeature(svcCartsConfig), DeliveryZonesModule],
  providers: [SvcCartsService],
  exports: [SvcCartsService]
})
export class SvcCartsModule {}

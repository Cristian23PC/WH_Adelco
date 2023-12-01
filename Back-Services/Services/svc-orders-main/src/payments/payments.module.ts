import { Module } from '@nestjs/common';
import { PaymentsRepository } from 'commercetools-sdk-repositories';
import { NestCommercetoolsModule } from '@/nest-commercetools';
import { PaymentsService } from './payments.service';

@Module({
  imports: [NestCommercetoolsModule.forFeature([PaymentsRepository])],
  providers: [PaymentsService],
  exports: [PaymentsService]
})
export class PaymentsModule {}

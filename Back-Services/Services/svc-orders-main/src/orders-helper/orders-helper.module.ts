import { Module } from '@nestjs/common';
import { OrdersHelperService } from './orders-helper.service';
import { SequenceModule } from '@/sequence/sequence.module';
import { StatesModule } from '@/state/states.module';
import { PaymentsModule } from '@/payments/payments.module';

@Module({
  imports: [SequenceModule, StatesModule, PaymentsModule],
  providers: [OrdersHelperService],
  exports: [OrdersHelperService]
})
export class OrdersHelperModule {}

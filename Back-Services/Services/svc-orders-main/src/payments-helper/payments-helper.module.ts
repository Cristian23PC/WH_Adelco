import { Module } from '@nestjs/common';
import { PaymentsHelperService } from './payments-helper.service';

@Module({
  providers: [PaymentsHelperService],
  exports: [PaymentsHelperService]
})
export class PaymentsHelperModule {}

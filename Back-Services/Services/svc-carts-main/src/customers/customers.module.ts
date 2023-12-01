import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { CustomersRepository } from 'commercetools-sdk-repositories';
import { CustomersService } from './customers.service';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomersRepository])],
  providers: [CustomersService],
  exports: [CustomersService]
})
export class CustomersModule {}

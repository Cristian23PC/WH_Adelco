import { Module } from '@nestjs/common';
import { CreditNotesService } from './credit-notes.service';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { NestCommercetoolsModule } from '@/nest-commercetools';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomObjectsRepository])],
  providers: [CreditNotesService],
  exports: [CreditNotesService]
})
export class CreditNotesModule {}

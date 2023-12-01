import { IQueryArgs } from '@/common/interfaces/query-args.interface';
import { InjectRepository } from '@/nest-commercetools';
import { Payment, PaymentDraft, PaymentUpdate } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from 'commercetools-sdk-repositories';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsRepository)
    private readonly paymentsRepository: PaymentsRepository
  ) {}

  async create(body: PaymentDraft): Promise<Payment> {
    return this.paymentsRepository.create({ body });
  }

  async update(ID: string, body: PaymentUpdate, queryArgs?: IQueryArgs): Promise<Payment> {
    return this.paymentsRepository.updateById(ID, { body, queryArgs });
  }
}

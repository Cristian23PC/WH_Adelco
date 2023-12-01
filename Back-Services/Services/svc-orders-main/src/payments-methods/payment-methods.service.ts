import { IPaymentMethod } from './interface/payment-method.interface';
import { InjectRepository } from '@/nest-commercetools';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';

@Injectable()
export class PaymentsMethodsService {
  constructor(
    @InjectRepository(CustomObjectsRepository)
    private readonly customObjectRepository: CustomObjectsRepository,
    private readonly configService: ConfigService
  ) {}

  private readonly PAYMENT_METHOD_DAY_CHECK = 'DayCheck';

  async getSelectedMethod(key: string, termDays: number): Promise<IPaymentMethod> {
    const container = this.configService.get<string>('custom-object-payment-method.paymentMethodContainer');
    const SAP_CASH_PAYMENT_CONDITION_CODE = this.configService.get<string>('custom-object-payment-method.sapCashPaymentConditionCode');
    const where = ['value(enabled=true)', `container="${container}"`, `key="${key}"`];

    const response = await this.customObjectRepository.find({
      queryArgs: {
        where,
        limit: 1
      }
    });

    if (!response.results.length) {
      throw new NotFoundException();
    }

    const paymentMethod = response.results[0];
    let term = 0;
    let condition = SAP_CASH_PAYMENT_CONDITION_CODE;
    if (paymentMethod.value.dependsOnCreditLineStatus) {
      term = paymentMethod.key === this.PAYMENT_METHOD_DAY_CHECK ? 1 : termDays;
      condition = paymentMethod.value.sapConditions?.[`${term}`] ?? '';
    }

    return {
      key: paymentMethod.key,
      sapPaymentCondition: condition,
      sapPaymentMethodCode: paymentMethod.value.sapMethod ?? ''
    };
  }
}

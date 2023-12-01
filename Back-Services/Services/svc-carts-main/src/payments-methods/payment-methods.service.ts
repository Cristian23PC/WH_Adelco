import { PaymentMethod, PaymentMethodsResponseDto } from '@/business-unit-carts/dto/business-unit-payment-methods.dto';
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

  private readonly DAY_CHECK = 'DayCheck';

  mapMethod(paymentMethod, creditLineDetails): PaymentMethod {
    let termDays = 0;
    if (paymentMethod.value.dependsOnCreditLineStatus) {
      termDays = paymentMethod.key === this.DAY_CHECK ? 1 : creditLineDetails.creditTermDays;
    }
    return {
      key: paymentMethod.key,
      description: paymentMethod.value.description.replace('%TERM%', creditLineDetails.creditTermDays),
      condition: paymentMethod.value.sapConditions[`${termDays}`] ?? '',
      termDays
    };
  }

  async getEnabledPaymentMethods(includeCreditLineMethods = false, creditLineDetails?: object): Promise<PaymentMethodsResponseDto> {
    const container = this.configService.get<string>('custom-object-payment-method.paymentMethodContainer');
    const where = ['value(enabled=true)', `container="${container}"`, 'value(displayAsPaymentOption=true)'];
    if (!includeCreditLineMethods) {
      where.push('value(dependsOnCreditLineStatus=false)');
    }
    const response = await this.customObjectRepository.find({
      queryArgs: {
        where,
        limit: 100
      }
    });

    if (!response.results.length) {
      throw new NotFoundException();
    }

    return {
      paymentMethods: response.results.map(method => this.mapMethod(method, creditLineDetails))
    };
  }
}

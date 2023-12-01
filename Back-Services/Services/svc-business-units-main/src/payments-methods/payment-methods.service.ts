import { PaymentMethodsResponseDto } from '@/business-units/dto/BusinessUnitPaymentsMethods.dto';
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
  async getEnabledPaymentMethods(buId: string): Promise<PaymentMethodsResponseDto> {
    const container = this.configService.get<string>('custom-object-payment-method.paymentMethodContainer');

    const response = await this.customObjectRepository.find({
      queryArgs: {
        where: [`container="${container}" and value(enabled=true)`],
        limit: 100
      }
    });

    if (!response.results.length) throw new NotFoundException();

    return {
      paymentMethods: response.results.map(({ key }) => ({ key }))
    };
  }
}

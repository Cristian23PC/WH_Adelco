import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BusinessUnitsHelper {
  constructor(private readonly configService: ConfigService) {}

  getMinimumOrderAmount() {
    return {
      minimumOrderAmount: {
        type: 'string',
        currencyCode: 'CLP',
        centAmount: parseInt(this.configService.get<string>('common.minimumOrderCentAmount')),
        fractionDigits: 0
      }
    };
  }
}

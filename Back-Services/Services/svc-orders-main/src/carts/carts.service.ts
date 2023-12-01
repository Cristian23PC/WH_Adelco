import { InjectRepository } from '@/nest-commercetools';
import { Cart, CartUpdateAction, LineItem, Payment } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartsRepository } from 'commercetools-sdk-repositories';
import { calculatePriceConditions } from '@adelco/price-calc';
import { isCompany } from '@/business-unit/utils/business-unit';
import { COMPANY_BLOCKED, DIVISION_BLOCKED } from '@/business-unit/constants';
import { ConvertedBusinessUnit } from '@/svc-business-units/svc-business-units.interface';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartsRepository)
    private readonly cartsRepository: CartsRepository,
    private readonly configService: ConfigService,
    @InjectRepository(BusinessUnitsRepository)
    private readonly businessUnitsRepository: BusinessUnitsRepository
  ) {}

  private shippingMethodKey = this.configService.get<string>('carts.shippingMethodKey');

  async update(cartId: string, version: number, actions: CartUpdateAction[]): Promise<Cart> {
    return this.cartsRepository.updateById(cartId, {
      body: {
        version,
        actions
      }
    });
  }

  buildPaymentAndShippingMethodActions(payment: Payment): CartUpdateAction[] {
    return [
      { action: 'addPayment', payment: { typeId: 'payment', id: payment.id } },
      { action: 'setShippingMethod', shippingMethod: { typeId: 'shipping-method', key: this.shippingMethodKey }, externalTaxRate: { name: 'noTax', amount: 0, country: 'CL' } }
    ];
  }

  buildSetDeliveryDateActions(deliveryDate: string): CartUpdateAction[] {
    return [
      {
        action: 'setCustomField',
        name: 'deliveryDate',
        value: deliveryDate
      }
    ];
  }

  async buildSetCreditBlockedReasonActions(businessUnit: ConvertedBusinessUnit): Promise<CartUpdateAction[]> {
    const isBuCompany = isCompany(businessUnit.unitType);

    if (businessUnit.isCreditBlocked) {
      return [
        {
          action: 'setCustomField',
          name: 'creditBlockedReason',
          value: isBuCompany ? COMPANY_BLOCKED : DIVISION_BLOCKED
        }
      ];
    }

    if (!isBuCompany) {
      const parentBusinessUnit = await this.businessUnitsRepository.getByKey(businessUnit.parentUnit?.key);

      if (parentBusinessUnit.custom?.fields.isCreditBlocked) {
        return [
          {
            action: 'setCustomField',
            name: 'creditBlockedReason',
            value: COMPANY_BLOCKED
          }
        ];
      }
    }

    return [];
  }

  buildSapPositionsActions(lineItems: LineItem[]): CartUpdateAction[] {
    return lineItems.map((lineItem: LineItem, index: number) => {
      //logic to prepare price conditions, splitting line items with different cart discount per quantity.
      const priceConditions = calculatePriceConditions(lineItem);
      const sapPositionsAction: CartUpdateAction = {
        action: 'setLineItemCustomField',
        lineItemId: lineItem.id,
        name: 'sapPositions',
        value: JSON.stringify({ quantity: lineItem.quantity, position: 10 * (index + 1), priceConditions })
      };

      return sapPositionsAction;
    });
  }

  async getBusinessUnitCreditTerm(businessUnit: ConvertedBusinessUnit) {
    const isBuCompany = isCompany(businessUnit.unitType);
    let creditTerm = businessUnit.creditTermDays;
    if (!isBuCompany) {
      const parentBusinessUnit = await this.businessUnitsRepository.getByKey(businessUnit.parentUnit?.key);
      creditTerm = parentBusinessUnit.custom?.fields.creditTermDays;
    }
    return creditTerm;
  }
}

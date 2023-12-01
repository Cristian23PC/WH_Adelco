import { SvcCartsService } from '@/svc-carts/svc-carts.service';
import { IConvertActiveCartProps } from './business-unit-orders.interface';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { Injectable } from '@nestjs/common';
import { OrdersService } from '@/orders/orders.service';
import { OrdersHelperService } from '@/orders-helper/orders-helper.service';
import { PaymentsService } from '@/payments/payments.service';
import { PaymentsHelperService } from '@/payments-helper/payments-helper.service';
import { CartsService } from '@/carts/carts.service';
import { AdelcoOrder, convertToAdelcoFormat } from '@adelco/price-calc';
import { SvcBusinessUnitsService } from '@/svc-business-units/svc-business-units.service';
import { KEY_ORDER_STATE } from '@/orders/orders.interface';
import { isBlockedByCredit } from '@/orders/utils/orders';
import { ECOMM_SOURCE_CUSTOM_FIELD } from '@/common/constants/carts';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';

@Injectable()
export class BusinessUnitOrdersService {
  constructor(
    private readonly svcCartsService: SvcCartsService,
    private readonly svcBusinessUnits: SvcBusinessUnitsService,
    private readonly ordersHelperService: OrdersHelperService,
    private readonly ordersService: OrdersService,
    private readonly paymentsHelperService: PaymentsHelperService,
    private readonly paymentsService: PaymentsService,
    private readonly cartsService: CartsService,
    private readonly paymentMethodsService: PaymentsMethodsService
  ) {}

  async convertActiveCart({ businessUnitId, body, username, roles }: IConvertActiveCartProps, forceUpdate?: boolean): Promise<AdelcoOrder> {
    const cart = await this.svcCartsService.getActiveCart(businessUnitId, username, roles, true);

    if (body.cartId && cart.id !== body.cartId) {
      throw ErrorBuilder.buildError('cartIdNotMatch');
    }

    if (!forceUpdate && (cart.cartUpdates?.isPriceUpdated || cart.cartUpdates?.isQuantityUpdated)) {
      throw ErrorBuilder.buildError('invalidStockOrPrice');
    }
    const businessUnit = await this.svcBusinessUnits.getById(businessUnitId, username, roles);

    if (body.source === ECOMM_SOURCE_CUSTOM_FIELD && cart.totalDetails.grossPrice < businessUnit.minimumOrderAmount?.centAmount) {
      throw ErrorBuilder.buildError('minimumAmountError');
    }

    const deliveryDate = cart.custom?.fields.deliveryDate;
    const nextDeliveryDate = await this.svcCartsService.checkAndGetDeliveryDateForCart(businessUnit.deliveryZoneKey, deliveryDate, body.source === ECOMM_SOURCE_CUSTOM_FIELD);

    const deliveryDateUpdateActions = nextDeliveryDate !== deliveryDate ? this.cartsService.buildSetDeliveryDateActions(nextDeliveryDate) : [];
    const creditBlockedReasonAction = await this.cartsService.buildSetCreditBlockedReasonActions(businessUnit);

    const payment = await this.paymentsService.create(this.paymentsHelperService.buildPaymentDraft(body.paymentMethod, cart.totalDetails, businessUnitId));
    const paymentAndShippingMethodActions = this.cartsService.buildPaymentAndShippingMethodActions(payment);
    const sapPositionsActions = this.cartsService.buildSapPositionsActions(cart.lineItems);
    const termDays = await this.cartsService.getBusinessUnitCreditTerm(businessUnit);
    const paymentMethodData = await this.paymentMethodsService.getSelectedMethod(body.paymentMethod, termDays);

    const updatedCart = await this.cartsService.update(cart.id, cart.version, [
      ...paymentAndShippingMethodActions,
      ...sapPositionsActions,
      ...deliveryDateUpdateActions,
      ...creditBlockedReasonAction
    ]);

    const orderDraft = await this.ordersHelperService.buildOrderFromCartDraft(updatedCart, {
      source: body.source,
      paymentCondition: paymentMethodData.sapPaymentCondition,
      sapPaymentMethodCode: paymentMethodData.sapPaymentMethodCode,
      customerComment: body.customerComment,
      purchaseNumber: body.purchaseNumber
    });

    let order = await this.ordersService.create(orderDraft);

    if (isBlockedByCredit(order.custom?.fields.creditBlockedReason)) {
      order = await this.ordersService.update(order.id, {
        version: order.version,
        actions: this.ordersService.buildSetTransitionStateAction(KEY_ORDER_STATE.BLOCKED_BY_CREDIT)
      });
    }

    return { ...convertToAdelcoFormat(order), cartUpdates: cart.cartUpdates };
  }
}

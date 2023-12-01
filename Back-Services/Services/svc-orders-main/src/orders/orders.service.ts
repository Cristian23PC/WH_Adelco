import { InjectRepository } from '@/nest-commercetools';
import {
  CentPrecisionMoney,
  Delivery,
  Money,
  Order,
  OrderChangePaymentStateAction,
  OrderFromCartDraft,
  OrderSetDeliveryCustomFieldAction,
  OrderTransitionLineItemStateAction,
  OrderTransitionStateAction,
  OrderUpdate,
  OrderUpdateAction,
  Payment,
  PaymentReference,
  PaymentSetCustomFieldAction,
  PaymentUpdate,
  PaymentUpdateAction
} from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { OrdersRepository } from 'commercetools-sdk-repositories';
import { UpdatePaymentDtoRequest } from './dto/update-payment.dto';
import { IMethodArgs } from '@/common/interfaces/method-args.interface';
import { PaymentsService } from '@/payments/payments.service';
import { AdelcoOrder, convertToAdelcoFormat } from '@adelco/price-calc';
import { CollectPaymentsResponse, KEY_LINE_ITEM_STATE, KEY_ORDER_STATE, KEY_PAYMENT_STATE, PAYMENT_STATE } from './orders.interface';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { STATE_STATUS } from '@/payments/payments.interface';
import { TaxedPriceDto, UpdateDeliveriesDtoRequest } from './dto/update-deliveries.dto';
import { DELIVERY_STATUS } from './enum/orders.enum';
import { PAYMENT_KEY_STATUS, PAYMENT_METHOD } from '@/payments/enum/payment.enum';
import { NotificationsService } from '@/notifications';
import { Coordinates } from '@/common/dto/coordinates.dto';
import { OrdersHelperService } from '@/orders-helper/orders-helper.service';
import { CollectPaymentsDtoRequest } from './dto/collect-payments.dto';
import { removeUndefinedValues } from '@/common/utils/formatter/formatter';
import { CreditNotesService } from '@/credit-notes/credit-notes.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    private readonly paymentService: PaymentsService,
    private readonly notificationsService: NotificationsService,
    private readonly ordersHelperService: OrdersHelperService,
    private readonly creditNotesService: CreditNotesService
  ) {}

  private defaultExpand = 'paymentInfo.payments[*].paymentStatus.state';
  private COMPLETED_STATES = [DELIVERY_STATUS.DELIVERED, DELIVERY_STATUS.PARTIAL];
  private TERMINAL_STATES = [...this.COMPLETED_STATES, DELIVERY_STATUS.NOT_DELIVERED];

  async create(body: OrderFromCartDraft): Promise<Order> {
    return this.ordersRepository.create({ body, queryArgs: { expand: ['paymentInfo.payments[*]'] } });
  }

  async getById(orderId: string, methodArgs?: IMethodArgs): Promise<Order> {
    return this.ordersRepository.getById(orderId, methodArgs);
  }

  async update(ID: string, body: OrderUpdate): Promise<Order> {
    return this.ordersRepository.updateById(ID, { body, queryArgs: { expand: [this.defaultExpand] } });
  }

  async getByDteNumbers(dteNumbers: string[]): Promise<Order[]> {
    const { results } = await this.ordersRepository.find({
      queryArgs: { where: `shippingInfo(deliveries(custom(fields(dteNumber in ("${dteNumbers.join('","')}")))))`, expand: ['paymentInfo.payments[*].paymentStatus.state'] }
    });

    if (!results.length) {
      throw ErrorBuilder.buildError('ordersNotFound', JSON.stringify(dteNumbers));
    }

    return results;
  }

  async collectPayments(
    { payments, invoices, businessUnitId, salesRepRUT, creditNotes: creditNotesDocumentNumbers }: CollectPaymentsDtoRequest,
    username: string
  ): Promise<CollectPaymentsResponse<Order>> {
    const orders = await this.getByDteNumbers(invoices);
    const creditNotes = await this.creditNotesService.getByCreditNotesKeys(creditNotesDocumentNumbers);
    const deliveries = this.ordersHelperService.formatDeliveries(orders, invoices);

    const combineCreditNotesAndPayments = this.ordersHelperService.combineCreditNotesAndPayments(creditNotes, payments);

    const { orderActions, paymentActions, creditNotesActions } = await this.ordersHelperService.handleCollectPayments(
      deliveries,
      combineCreditNotesAndPayments,
      businessUnitId,
      salesRepRUT,
      creditNotes,
      username
    );

    const ordersUpdated = await Promise.all(
      orderActions.map(async ({ orderId, ...body }) => {
        const orderUpdated = await this.update(orderId, body);
        if (body.actions.some(({ action }) => action === 'removePayment')) {
          await this.notificationsService.sendNotification(
            {
              type: 'OrderPaymentRemoved',
              resource: { id: orderId }
            },
            'orderUpdate'
          );
        }
        const deliveryActions = body.actions.filter(({ action }) => action === 'setDeliveryCustomField');
        if (deliveryActions.length) {
          await Promise.all(
            deliveryActions.map(async ({ deliveryId, name }: OrderSetDeliveryCustomFieldAction) => {
              if (name === 'paymentInfo') {
                await this.notificationsService.sendNotification(
                  {
                    type: 'DeliveryPaymentInfoUpdated',
                    deliveryId
                  },
                  'mongoDeliveriesSync'
                );
              } else {
                await this.notificationsService.sendNotification(
                  {
                    type: 'DeliveryUpdated',
                    deliveryId
                  },
                  'mongoDeliveriesSync'
                );
              }
            })
          );
        }
        return orderUpdated;
      })
    );
    const paymentsUpdated = await Promise.all(
      paymentActions.map(async ({ paymentId, ...body }) => await this.paymentService.update(paymentId, body, { expand: 'paymentStatus.state' }))
    );

    const creditNotesUpdated = await Promise.all(creditNotesActions.map(async creditNotesDraft => await this.creditNotesService.update(creditNotesDraft)));

    return {
      orders: ordersUpdated,
      payments: paymentsUpdated.filter(({ paymentStatus }) => paymentStatus.state.obj.key !== KEY_PAYMENT_STATE.CANCELLED),
      creditNotes: creditNotesUpdated
    };
  }

  async updatePayment(orderId: string, body: UpdatePaymentDtoRequest, username: string): Promise<AdelcoOrder> {
    const order = await this.getById(orderId, { queryArgs: { expand: [this.defaultExpand] } });
    const { obj } = order.paymentInfo?.payments.find(payment => payment.id === body.paymentId) || {};

    if (!obj) {
      throw ErrorBuilder.buildError('paymentNotAssociated');
    }

    let orderUpdated = order;
    if (obj.paymentStatus.state?.obj?.key !== KEY_PAYMENT_STATE.PAID) {
      const delivery = order.shippingInfo.deliveries.find(({ id }) => body.deliveryId === id);

      const payment = await this.paymentService.update(obj.id, this.buildPaymentUpdateAction(body, obj, delivery, username), { expand: ['paymentStatus.state'] });
      orderUpdated = await this.update(order.id, this.buildOrderUpdateAction(body, order, payment));

      await this.notificationsService.sendNotification(
        {
          type: 'DeliveryPaymentInfoUpdated',
          deliveryId: body.deliveryId
        },
        'mongoDeliveriesSync'
      );
    }

    return convertToAdelcoFormat(orderUpdated);
  }

  async updateDeliveries(orderId: string, body: UpdateDeliveriesDtoRequest): Promise<AdelcoOrder> {
    let order = await this.getById(orderId, { queryArgs: { expand: [this.defaultExpand, 'lineItems[*].state[*].state'] } });

    const delivery = order.shippingInfo.deliveries.find(delivery => delivery.id === body.deliveryId);

    if (delivery && delivery.custom.fields.state !== DELIVERY_STATUS.PENDING) {
      await this.reversePaymentForNotDeliveredStatus(delivery, order);
      order = await this.update(order.id, this.reverseTransitionLineItemState(delivery, order));
    }

    const orderUpdated = await this.update(order.id, this.buildUpdateDeliveriesActions(delivery, body, order));

    if (body.status === DELIVERY_STATUS.NOT_DELIVERED) {
      await this.updatePaymentForNotDeliveredStatus(delivery, order);
    }

    await this.notificationsService.sendNotification(
      {
        type: 'DeliveryUpdated',
        deliveryId: body.deliveryId
      },
      'mongoDeliveriesSync'
    );

    return convertToAdelcoFormat(orderUpdated);
  }

  buildSetTransitionStateAction(keyState: KEY_ORDER_STATE): OrderUpdateAction[] {
    return [
      {
        action: 'transitionState',
        state: {
          typeId: 'state',
          key: keyState
        }
      }
    ];
  }

  private buildUpdateDeliveriesActions(delivery: Delivery, updateDeliveriesRequest: UpdateDeliveriesDtoRequest, order: Order): OrderUpdate {
    return {
      version: order.version,
      actions: [
        ...this.buildSetDeliveryCustomFieldActions(updateDeliveriesRequest, order, delivery),
        ...this.buildTransitionLineItemState(updateDeliveriesRequest, delivery),
        ...this.buildOrderTransitionStateActions(updateDeliveriesRequest, order)
      ]
    };
  }

  async reversePaymentForNotDeliveredStatus(delivery: Delivery, order: Order): Promise<Payment> {
    const { obj: payment } = order.paymentInfo?.payments.find(payment => payment.id === delivery.custom?.fields?.paymentInfo?.[0]) || {};
    if (!payment) {
      return;
    }

    if (payment.paymentStatus.state.obj.key === KEY_PAYMENT_STATE.PENDING) {
      return;
    }

    if (payment.paymentStatus.state.obj.key !== KEY_PAYMENT_STATE.CANCELLED) {
      throw ErrorBuilder.buildError('paymentNotCanceled');
    }

    return await this.paymentService.update(payment.id, {
      version: payment.version,
      actions: [
        {
          action: 'transitionState',
          state: {
            typeId: 'state',
            key: KEY_PAYMENT_STATE.PENDING
          }
        }
      ]
    });
  }

  async updatePaymentForNotDeliveredStatus(delivery: Delivery, order: Order): Promise<Payment> {
    const { obj: payment } = order.paymentInfo?.payments.find(payment => payment.id === delivery.custom?.fields?.paymentInfo?.[0]) || {};

    if (!payment) {
      return;
    }

    return await this.paymentService.update(payment.id, {
      version: payment.version,
      actions: [
        {
          action: 'transitionState',
          state: {
            typeId: 'state',
            key: KEY_PAYMENT_STATE.CANCELLED
          }
        }
      ]
    });
  }

  private buildOrderUpdateAction(updatePaymentRequest: UpdatePaymentDtoRequest, order: Order, payment: Payment): OrderUpdate {
    return {
      version: order.version,
      actions: [...this.buildOrderChangePaymentStateAction(order, payment), ...this.buildOrderSetDeliveryCustomFieldAction(updatePaymentRequest, order)]
    };
  }

  private buildOrderChangePaymentStateAction({ paymentInfo, shippingInfo: { deliveries } }: Order, payment: Payment): OrderChangePaymentStateAction[] {
    const { payments } = paymentInfo || {};
    const newPayments = payments.map((value: PaymentReference) => {
      if (value.id === payment.id) {
        return {
          typeId: 'payment',
          id: payment.id,
          obj: payment
        };
      }

      return value;
    });

    const deliveriesOwedAmount = deliveries.reduce((acc, value) => (value.custom.fields.owedAmount?.centAmount || 0) + acc, 0);

    const hasPendingPayment = newPayments?.some(payment => payment.obj?.paymentStatus.state?.obj.key === STATE_STATUS.PENDING);
    const isBalanceDue = hasPendingPayment || deliveriesOwedAmount > 0;

    return [
      {
        action: 'changePaymentState',
        paymentState: isBalanceDue ? PAYMENT_STATE.BALANCE_DUE : PAYMENT_STATE.PAID
      }
    ];
  }

  private buildOrderSetDeliveryCustomFieldAction({ amountPaid, documentId }: UpdatePaymentDtoRequest, { shippingInfo }: Order): OrderSetDeliveryCustomFieldAction[] {
    const delivery = shippingInfo.deliveries.find(delivery => delivery.custom?.fields?.dteNumber === documentId);
    const owedAmount = (delivery.custom?.fields?.owedAmount as Money) || { currencyCode: 'CLP', centAmount: amountPaid };

    return [
      {
        action: 'setDeliveryCustomField',
        deliveryId: delivery.id,
        name: 'owedAmount',
        value: {
          ...owedAmount,
          centAmount: owedAmount.centAmount - amountPaid
        }
      }
    ];
  }

  private buildPaymentUpdateAction(updatePaymentRequest: UpdatePaymentDtoRequest, payment: Payment, delivery: Delivery, username: string): PaymentUpdate {
    const { amountPaid, method } = updatePaymentRequest;

    return {
      version: payment.version,
      actions: [
        {
          action: 'setCustomField',
          name: 'collectedBy',
          value: username
        },
        {
          action: 'changeAmountPlanned',
          amount: {
            currencyCode: 'CLP',
            centAmount: amountPaid
          }
        },
        delivery.custom?.fields?.transportDocumentId
          ? {
              action: 'setCustomField',
              name: 'transportDocumentId',
              value: delivery.custom.fields.transportDocumentId
            }
          : undefined,
        {
          action: 'setCustomField',
          name: 'paymentDate',
          value: new Date().toISOString().split('T')[0]
        },
        delivery.custom?.fields?.carrierRUT
          ? {
              action: 'setCustomField',
              name: 'carrierRUT',
              value: delivery.custom.fields.carrierRUT
            }
          : undefined,
        {
          action: 'setCustomField',
          name: 'associatedDocs',
          value: JSON.stringify(
            removeUndefinedValues([
              {
                documentId: delivery.key,
                dteType: delivery.custom?.fields?.dteType,
                dteNumber: delivery.custom?.fields?.dteNumber,
                dteDate: delivery.custom?.fields?.dteDate,
                sapDocumentId: delivery.custom?.fields?.sapDocumentId,
                amount: updatePaymentRequest.amountPaid,
                isPartial: updatePaymentRequest.amountPaid < delivery.custom?.fields?.owedAmount?.centAmount,
                carrierRUT: delivery.custom?.fields.carrierRUT // TODO: temporarily keeping carrierRUT in associatedDocs until consumers are updated and deployed.
              }
            ])
          )
        },
        {
          action: 'transitionState',
          state: {
            typeId: 'state',
            key: method === PAYMENT_METHOD.CREDIT ? KEY_PAYMENT_STATE.CREDIT_OWED : KEY_PAYMENT_STATE.PAID
          }
        },
        {
          action: 'setMethodInfoMethod',
          method
        },
        ...this.buildCardSetExtraInfoCustomFieldActions(updatePaymentRequest),
        ...this.buildCardSetPaymentCustomFieldActions(updatePaymentRequest),
        ...this.buildCheckSetPaymentCustomFieldActions(updatePaymentRequest),
        ...this.buildBankTranferSetPaymentCustomFieldActions(updatePaymentRequest)
      ].filter(item => item) as PaymentUpdateAction[]
    };
  }

  private buildSetDeliveryCustomFieldActions(
    { deliveryId, date, status, deliveryCoordinates, newDeliveryTotal, noDeliveredItems, noDeliveryReason }: UpdateDeliveriesDtoRequest,
    order: Order,
    delivery: Delivery
  ): OrderSetDeliveryCustomFieldAction[] {
    const oldNoDeliveryReason = delivery.custom?.fields.noDeliveryReason;

    return [
      {
        action: 'setDeliveryCustomField',
        deliveryId: deliveryId,
        name: 'deliveryDate',
        value: date
      },
      {
        action: 'setDeliveryCustomField',
        deliveryId: deliveryId,
        name: 'state',
        value: status
      },
      noDeliveryReason !== oldNoDeliveryReason
        ? {
            action: 'setDeliveryCustomField',
            deliveryId: deliveryId,
            name: 'noDeliveryReason',
            value: noDeliveryReason
          }
        : undefined,
      ...this.buildDeliveryCoordinates(deliveryCoordinates, deliveryId),
      ...this.buildPartialStatusSetDeliveryCustomField(newDeliveryTotal, deliveryId, status, order, delivery),
      ...this.buildNotDeliveredStatusSetDeliveryCustomField(deliveryId, status),
      ...this.buildPositionsMappingSetDeliveryCustomField(deliveryId, delivery, noDeliveredItems)
    ].filter(item => item) as OrderSetDeliveryCustomFieldAction[];
  }

  private buildDeliveryCoordinates(deliveryCoordinates: Coordinates, deliveryId: string): OrderSetDeliveryCustomFieldAction[] {
    return deliveryCoordinates
      ? [
          {
            action: 'setDeliveryCustomField',
            deliveryId: deliveryId,
            name: 'lat',
            value: deliveryCoordinates.lat
          },
          {
            action: 'setDeliveryCustomField',
            deliveryId: deliveryId,
            name: 'long',
            value: deliveryCoordinates.long
          }
        ]
      : [];
  }

  private buildPositionsMappingSetDeliveryCustomField(deliveryId: string, delivery: Delivery, noDeliveredItems: UpdateDeliveriesDtoRequest['noDeliveredItems']) {
    const positionsMapping = JSON.parse(delivery.custom.fields?.positionsMapping || '[]');

    if (!positionsMapping.length) return [];

    const newPositionMapping = JSON.stringify(
      positionsMapping.map(lineItem => {
        const noDeliveredItem = noDeliveredItems?.find(({ lineItemCtId }) => lineItemCtId === lineItem.id);
        if (noDeliveredItem) {
          return { ...lineItem, notDeliveredQuantity: noDeliveredItem.quantity };
        }
        return { id: lineItem.id, pos: lineItem.pos };
      })
    );

    return newPositionMapping !== delivery.custom.fields?.positionsMapping
      ? [
          {
            action: 'setDeliveryCustomField',
            deliveryId: deliveryId,
            name: 'positionsMapping',
            value: newPositionMapping
          }
        ]
      : [];
  }

  private buildPartialStatusSetDeliveryCustomField(
    newDeliveryTotal: TaxedPriceDto,
    deliveryId: string,
    status: DELIVERY_STATUS,
    order: Order,
    delivery: Delivery
  ): OrderSetDeliveryCustomFieldAction[] {
    return status === DELIVERY_STATUS.PARTIAL
      ? [
          {
            action: 'setDeliveryCustomField',
            deliveryId: deliveryId,
            name: 'deliveryTotalAmount',
            value: {
              currencyCode: 'CLP',
              centAmount: newDeliveryTotal?.totalGross
            }
          },
          ...this.buildOwedAmountSetDeliveryCustomField(order.paymentInfo.payments, delivery, newDeliveryTotal)
        ]
      : [];
  }
  private buildNotDeliveredStatusSetDeliveryCustomField(deliveryId: string, status: DELIVERY_STATUS): OrderSetDeliveryCustomFieldAction[] {
    return status === DELIVERY_STATUS.NOT_DELIVERED
      ? [
          {
            action: 'setDeliveryCustomField',
            deliveryId: deliveryId,
            name: 'deliveryTotalAmount',
            value: {
              currencyCode: 'CLP',
              centAmount: 0
            }
          },
          {
            action: 'setDeliveryCustomField',
            deliveryId: deliveryId,
            name: 'owedAmount',
            value: {
              currencyCode: 'CLP',
              centAmount: 0
            }
          }
        ]
      : [];
  }

  reverseTransitionLineItemState(delivery: Delivery, order: Order): OrderUpdate {
    const actions: OrderTransitionLineItemStateAction[] = [];
    for (const { id: deliveryItemId } of delivery?.items) {
      const currentItem = order.lineItems.find(({ id }) => id === deliveryItemId);
      for (const { quantity, state } of currentItem.state) {
        if ([KEY_LINE_ITEM_STATE.RETURNED, KEY_LINE_ITEM_STATE.DELIVERED].includes(state.obj.key as KEY_LINE_ITEM_STATE)) {
          actions.push({
            action: 'transitionLineItemState',
            lineItemId: deliveryItemId,
            fromState: {
              typeId: 'state',
              key: state.obj.key
            },
            quantity,
            toState: {
              typeId: 'state',
              key: KEY_LINE_ITEM_STATE.SHIPPED
            }
          });
        }
      }
    }
    return {
      version: order.version,
      actions
    };
  }

  private buildTransitionLineItemState({ noDeliveredItems }: UpdateDeliveriesDtoRequest, delivery: Delivery): OrderTransitionLineItemStateAction[] {
    const mappedItems =
      delivery?.items.map(item => {
        const noDeliveryItem = noDeliveredItems?.find(value => value.lineItemCtId === item.id);
        const returnedQuantity = noDeliveryItem?.quantity || 0;

        return {
          id: item.id,
          quantityReturned: returnedQuantity,
          quantityReceived: item.quantity - returnedQuantity
        };
      }) || [];

    return mappedItems.reduce((prev, item) => {
      const common: Partial<OrderTransitionLineItemStateAction> = {
        action: 'transitionLineItemState',
        lineItemId: item.id,
        fromState: {
          typeId: 'state',
          key: KEY_LINE_ITEM_STATE.SHIPPED
        }
      };
      if (item.quantityReturned) {
        prev.push({
          ...common,
          quantity: item.quantityReturned,
          toState: {
            typeId: 'state',
            key: KEY_LINE_ITEM_STATE.RETURNED
          }
        } as OrderTransitionLineItemStateAction);
      }
      if (item.quantityReceived) {
        prev.push({
          ...common,
          quantity: item.quantityReceived,
          toState: {
            typeId: 'state',
            key: KEY_LINE_ITEM_STATE.DELIVERED
          }
        } as OrderTransitionLineItemStateAction);
      }

      return prev;
    }, [] as OrderTransitionLineItemStateAction[]);
  }

  private buildOrderTransitionStateActions({ deliveryId, status }: UpdateDeliveriesDtoRequest, { shippingInfo }: Order): OrderTransitionStateAction[] {
    const oldDeliveries = shippingInfo?.deliveries.filter(delivery => delivery.id !== deliveryId) || [];
    const deliveries = [...oldDeliveries, { custom: { fields: { state: status } } }];
    const allInTerminalState = deliveries.every(delivery => this.TERMINAL_STATES.includes(delivery.custom?.fields.state));

    if (!allInTerminalState) return [];

    const isCompleted = deliveries.some(delivery => this.COMPLETED_STATES.includes(delivery.custom?.fields.state));

    if (isCompleted) {
      return [{ action: 'transitionState', state: { typeId: 'state', key: KEY_ORDER_STATE.COMPLETED } }];
    } else {
      return [{ action: 'transitionState', state: { typeId: 'state', key: KEY_ORDER_STATE.NOT_DELIVERED } }];
    }
  }

  private buildCardSetExtraInfoCustomFieldActions({ extraInfo }: UpdatePaymentDtoRequest): PaymentSetCustomFieldAction[] {
    return extraInfo
      ? [
          {
            action: 'setCustomField',
            name: 'extraInfo',
            value: extraInfo
          }
        ]
      : [];
  }
  private buildCardSetPaymentCustomFieldActions({ trxNumber, method }: UpdatePaymentDtoRequest): PaymentSetCustomFieldAction[] {
    return method === PAYMENT_METHOD.CREDIT_CARD || method === PAYMENT_METHOD.DEBIT_CARD
      ? [
          {
            action: 'setCustomField',
            name: 'trxNumber',
            value: trxNumber
          }
        ]
      : [];
  }

  private buildBankTranferSetPaymentCustomFieldActions({ transferNumber, bankCode, accountNumber, method }: UpdatePaymentDtoRequest): PaymentSetCustomFieldAction[] {
    return method === PAYMENT_METHOD.BANK_TRANSFER
      ? [
          {
            action: 'setCustomField',
            name: 'transferNumber',
            value: transferNumber
          },
          {
            action: 'setCustomField',
            name: 'bankCode',
            value: bankCode
          },
          {
            action: 'setCustomField',
            name: 'accountNumber',
            value: accountNumber
          }
        ]
      : [];
  }

  private buildCheckSetPaymentCustomFieldActions({ checkNumber, method }: UpdatePaymentDtoRequest): PaymentSetCustomFieldAction[] {
    return method === PAYMENT_METHOD.DAY_CHECK
      ? [
          {
            action: 'setCustomField',
            name: 'checkNumber',
            value: checkNumber
          },
          {
            action: 'setCustomField',
            name: 'checkExpirationDate',
            value: new Date().toISOString()
          }
        ]
      : [];
  }

  private buildOwedAmountSetDeliveryCustomField(payments: PaymentReference[], delivery: Delivery, newDeliveryTotal: TaxedPriceDto): OrderSetDeliveryCustomFieldAction[] {
    const paymentsUpdated = payments
      .map(payment => {
        const paymentIdsInfo = delivery.custom?.fields?.paymentInfo || [];
        if (paymentIdsInfo.some((value: string) => value === payment.id)) {
          return payment.obj;
        }
      })
      .filter(item => item);
    const amountPaid = paymentsUpdated.reduce((prev: number, payment: Payment) => {
      if (payment.paymentStatus.state?.obj?.key === PAYMENT_KEY_STATUS.PAID) {
        return prev + payment.amountPlanned.centAmount;
      }
      return prev + 0;
    }, 0);

    return [
      {
        action: 'setDeliveryCustomField',
        deliveryId: delivery.id,
        name: 'owedAmount',
        value: {
          currencyCode: 'CLP',
          centAmount: newDeliveryTotal.totalGross - amountPaid
        }
      }
    ];
  }
}

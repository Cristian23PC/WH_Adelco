import {
  Cart,
  Order,
  OrderAddPaymentAction,
  OrderSetDeliveryCustomFieldAction,
  OrderFromCartDraft,
  Payment,
  OrderUpdateAction,
  CustomObject,
  PaymentSetCustomFieldAction,
  CustomObjectDraft
} from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { SequenceService } from '@/sequence/sequence.service';
import { removeUndefinedValues } from '@/common/utils/formatter/formatter';
import { IPaymentCancelled, KEY_ORDER_STATE, KEY_PAYMENT_STATE, PAYMENT_STATE, SHIPMENT_STATE } from '@/orders/orders.interface';
import { StatesService } from '@/state/states.service';
import { CollectPaymentsDtoRequest } from '@/orders/dto/collect-payments.dto';
import { PaymentsService } from '@/payments/payments.service';
import {
  CombineCreditNotesAndPaymentsResponse,
  CombineCreditNotes,
  IAssociatedDocsForCreditNotes,
  IAssociatedDocsForPayments,
  ICreatePayment,
  IFormatDelivery,
  IGetPaymentsPendingAndPaids,
  IHandleCollectPayments,
  IOrderActions,
  IOrderDeliveryAction,
  IPaymentAction,
  IPaymentActions,
  OrderCustomFieldsDraftProps,
  CombinePayment
} from './orders-helper.interface';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { PAYMENT_METHOD } from '@/payments/enum/payment.enum';

@Injectable()
export class OrdersHelperService {
  constructor(private readonly sequenceService: SequenceService, private readonly statesService: StatesService, private readonly paymentsService: PaymentsService) {}

  async buildOrderFromCartDraft(cart: Cart, orderCustomFields: OrderCustomFieldsDraftProps): Promise<OrderFromCartDraft> {
    const state = await this.statesService.getByKey(KEY_ORDER_STATE.OPEN);

    return removeUndefinedValues({
      cart: {
        typeId: 'cart',
        id: cart.id
      },
      version: cart.version,
      orderNumber: await this.sequenceService.getOrderNumber('orderNumberKey'),
      paymentState: PAYMENT_STATE.PENDING,
      shipmentState: SHIPMENT_STATE.PENDING,
      state: {
        typeId: 'state',
        id: state.id
      },
      custom: {
        type: {
          typeId: 'type',
          key: 'adelco-cart-type'
        },
        fields: orderCustomFields
      }
    });
  }

  formatDeliveries(orders: Order[], invoices: string[]): IFormatDelivery[] {
    const deliveries = orders.reduce((prev: IFormatDelivery[], { shippingInfo, paymentInfo, id, version }: Order) => {
      const filteredDeliveries = shippingInfo.deliveries.filter(delivery => invoices.some(invoice => invoice === delivery.custom?.fields?.dteNumber));

      filteredDeliveries.forEach(delivery => {
        const deliveryPayments = delivery.custom?.fields?.paymentInfo?.map((deliveryPayment: string) => {
          return paymentInfo.payments?.find(payment => payment.id === deliveryPayment)?.obj;
        });

        prev.push({
          ...delivery,
          custom: {
            ...delivery.custom,
            fields: {
              ...delivery.custom?.fields,
              paymentInfo: deliveryPayments,
              orderId: id,
              orderVersion: version
            }
          }
        });
      });

      return prev;
    }, [] as IFormatDelivery[]);

    if (deliveries.length !== invoices.length) {
      const missingInvoices = invoices.filter(invoice => !deliveries.some(delivery => delivery.custom?.fields?.dteNumber === invoice));
      throw ErrorBuilder.buildError('deliveriesMissing', JSON.stringify(missingInvoices));
    }

    return deliveries.sort((a, b) => {
      return new Date(a.custom?.fields?.expirationDate).valueOf() - new Date(b.custom?.fields?.expirationDate).valueOf();
    });
  }

  combineCreditNotesAndPayments(creditNotes: CustomObject[], payments: CollectPaymentsDtoRequest['payments']): CombineCreditNotesAndPaymentsResponse[] {
    const mapCreditNotes: CombineCreditNotes[] = creditNotes.map(creditNote =>
      removeUndefinedValues<CombineCreditNotes>({
        creditNoteId: creditNote.id,
        method: PAYMENT_METHOD.CREDIT_NOTE,
        documentId: creditNote.value?.documentId,
        dteType: creditNote.value?.dteType ?? 'NTC',
        dteNumber: creditNote.value?.dteNumber,
        dteDate: creditNote.value?.dteDate,
        amountPaid: creditNote.value?.grossAmount.centAmount,
        isCreditNote: true
      })
    );
    const mapPayments: CombinePayment[] = payments.map(payment => ({
      ...payment,
      isCreditNote: false
    }));

    return [...mapCreditNotes, ...mapPayments] as CombineCreditNotesAndPaymentsResponse[];
  }

  async handleCollectPayments(
    deliveries: IFormatDelivery[],
    payments: CombineCreditNotesAndPaymentsResponse[],
    businessUnitId: string,
    salesRepRUT: string,
    creditNotes: CustomObject[],
    username: string
  ): Promise<IHandleCollectPayments> {
    const paymentsCancelled: IPaymentCancelled[] = [];
    const orderActions: IOrderActions = {};

    const paymentActions: IPaymentActions = {};

    const creditNotesActions: CustomObjectDraft[] = [];

    let currentDeliveryIndex = 0;
    let owedAmountCurrentDelivery = deliveries[currentDeliveryIndex].custom?.fields.owedAmount.centAmount ?? 0;
    let paymentIndex = -1;

    for (const payment of payments) {
      let associatedDocs: (IAssociatedDocsForPayments | IAssociatedDocsForCreditNotes)[] = [];
      paymentIndex++;
      let remainingMoney = payment.amountPaid;

      const ctPayment = await this.createPayment({ centAmount: payment.amountPaid, payment, businessUnitId, paymentState: KEY_PAYMENT_STATE.PENDING });

      while (remainingMoney > 0 && (owedAmountCurrentDelivery > 0 || currentDeliveryIndex < deliveries.length - 1)) {
        if (owedAmountCurrentDelivery === 0) {
          currentDeliveryIndex++;
          owedAmountCurrentDelivery = deliveries[currentDeliveryIndex].custom?.fields.owedAmount.centAmount ?? 0;
        }
        const delivery = deliveries[currentDeliveryIndex];
        const { orderId, paymentInfo, orderVersion } = delivery.custom?.fields || {};
        orderActions[orderId] = { orderId, version: orderVersion, actions: [], ...(orderActions[orderId] || {}) };

        const { paymentsPaids, paymentsPending } = this.getPaymentsPendingAndPaids(paymentInfo);

        paymentsCancelled.push(...paymentsPending);

        paymentsPending.forEach(({ id }) => {
          orderActions[orderId] = this.consolidateOrderPaymentAction('removePayment', orderActions[orderId], id);
        });

        const newPaymentInfo = [...paymentsPaids];
        let isPartial = false;
        let paidAmount: number;
        let creditNote: CustomObject;

        if (remainingMoney >= owedAmountCurrentDelivery) {
          // full payment
          orderActions[orderId] = this.consolidateOrderDeliveryOwedAction(orderActions[orderId], { centAmount: 0, deliveryId: delivery.id });
          remainingMoney = remainingMoney - owedAmountCurrentDelivery;
          isPartial = false;
          if (paymentIndex === payments.length - 1 && currentDeliveryIndex === deliveries.length - 1) {
            paidAmount = owedAmountCurrentDelivery + remainingMoney;
          } else {
            paidAmount = owedAmountCurrentDelivery;
          }
          owedAmountCurrentDelivery = 0;
        } else {
          // partial payment
          orderActions[orderId] = this.consolidateOrderDeliveryOwedAction(orderActions[orderId], {
            centAmount: owedAmountCurrentDelivery - remainingMoney,
            deliveryId: delivery.id
          });
          isPartial = true;
          owedAmountCurrentDelivery = owedAmountCurrentDelivery - remainingMoney;
          paidAmount = remainingMoney;
          remainingMoney = 0;

          // is last payment and partial payment?
          if (paymentIndex === payments.length - 1) {
            const { id } = await this.createPayment({ centAmount: owedAmountCurrentDelivery, payment, businessUnitId, paymentState: KEY_PAYMENT_STATE.PENDING });
            orderActions[orderId] = this.consolidateOrderPaymentAction('addPayment', orderActions[orderId], id);
            newPaymentInfo.push(id);
          }
        }

        if (payment.isCreditNote) {
          creditNote = creditNotes.find(value => value.id === (payment as CombineCreditNotes).creditNoteId);
          creditNotesActions.push({
            ...creditNote,
            value: {
              ...creditNote.value,
              state: 'Closed'
            }
          });
        }

        orderActions[orderId] = this.consolidateOrderPaymentAction('addPayment', orderActions[orderId], ctPayment.id);
        newPaymentInfo.push(ctPayment.id);

        orderActions[orderId] = this.consolidateOrderDeliveryPaymentAction(orderActions[orderId], { deliveryId: delivery.id, paymentInfo: newPaymentInfo });

        if (payment.isCreditNote && creditNote) {
          associatedDocs = [...associatedDocs, this.addPaymentCreditNotesRelation(creditNote, paidAmount, isPartial)];
        } else {
          associatedDocs = [...associatedDocs, this.addPaymentDeliveryRelation(delivery, paidAmount, isPartial)];
        }
      }

      const initialPaymentStructure = { paymentId: ctPayment.id, version: ctPayment.version, actions: [] };

      paymentActions[ctPayment.id] = this.paymentAction('setCustomField', initialPaymentStructure, ctPayment.id, ctPayment.version, {
        associatedDocs: Object.values(associatedDocs)
      });

      paymentActions[ctPayment.id] = this.paymentAction('transitionState', paymentActions[ctPayment.id], ctPayment.id, ctPayment.version, {
        paymentState: KEY_PAYMENT_STATE.PAID
      });

      paymentActions[ctPayment.id] = this.setSalesRepRut(paymentActions[ctPayment.id], salesRepRUT);
      paymentActions[ctPayment.id] = this.setCollectedBy(paymentActions[ctPayment.id], username);
    }

    paymentsCancelled.forEach(({ version, id }) => {
      paymentActions[id] = this.paymentAction('transitionState', paymentActions[id] || { paymentId: id, version, actions: [] }, id, version);
    });

    return { orderActions: Object.values(orderActions), paymentActions: Object.values(paymentActions), creditNotesActions };
  }

  private removeDuplicate(arr) {
    return arr.reduce(function (acc, curr) {
      if (!acc.includes(curr)) acc.push(curr);
      return acc;
    }, []);
  }

  private consolidateOrderDeliveryPaymentAction(orderActions: IOrderActions[string], { deliveryId, paymentInfo }: IOrderDeliveryAction): IOrderActions[string] {
    const existingAction = orderActions?.actions?.find((action: OrderSetDeliveryCustomFieldAction) => action.name === 'paymentInfo' && action.deliveryId === deliveryId);
    const filteredActions = existingAction
      ? orderActions?.actions?.filter((action: OrderSetDeliveryCustomFieldAction) => action.name !== 'paymentInfo' || action.deliveryId !== deliveryId)
      : orderActions?.actions;

    const newAction: OrderSetDeliveryCustomFieldAction = {
      action: 'setDeliveryCustomField',
      deliveryId,
      name: 'paymentInfo',
      value: existingAction ? this.removeDuplicate([...(existingAction as OrderSetDeliveryCustomFieldAction).value, ...paymentInfo]) : paymentInfo
    };
    return {
      ...orderActions,
      actions: [...(filteredActions || []), newAction]
    };
  }

  private consolidateOrderDeliveryOwedAction(orderActions: IOrderActions[string], { deliveryId, centAmount }: IOrderDeliveryAction): IOrderActions[string] {
    const filteredActions = orderActions?.actions?.filter((action: OrderSetDeliveryCustomFieldAction) => action.name !== 'owedAmount' || action.deliveryId !== deliveryId);

    const newAction: OrderUpdateAction = {
      action: 'setDeliveryCustomField',
      deliveryId,
      name: 'owedAmount',
      value: {
        currencyCode: 'CLP',
        centAmount
      }
    };
    return {
      ...orderActions,
      actions: [...(filteredActions || []), newAction]
    };
  }

  private consolidateOrderPaymentAction(action: 'addPayment' | 'removePayment', orderActions: IOrderActions[string], paymentId: string): IOrderActions[string] {
    const filteredActions = orderActions?.actions?.filter(({ payment }: OrderAddPaymentAction) => paymentId !== payment?.id);
    const newAction: OrderUpdateAction = {
      action,
      payment: {
        typeId: 'payment',
        id: paymentId
      }
    };
    return {
      ...orderActions,
      actions: [...(filteredActions || []), newAction]
    };
  }

  private paymentAction(
    action: 'transitionState' | 'setCustomField',
    paymentActions: IPaymentActions[string],
    paymentId: string,
    version: number,
    { associatedDocs, paymentState = KEY_PAYMENT_STATE.CANCELLED }: IPaymentAction = {}
  ): IPaymentActions[string] {
    if (action === 'transitionState' && !paymentActions.actions?.some(action => (action as any).state?.key === paymentState)) {
      const paymentDateAction: PaymentSetCustomFieldAction[] =
        paymentState === KEY_PAYMENT_STATE.PAID ? [{ action: 'setCustomField', name: 'paymentDate', value: new Date().toISOString().split('T')[0] }] : [];

      return {
        paymentId,
        version,
        actions: [
          ...(paymentActions?.actions || []),
          ...paymentDateAction,
          {
            action,
            state: {
              typeId: 'state',
              key: paymentState
            }
          }
        ]
      };
    }
    if (action === 'setCustomField') {
      return {
        ...paymentActions,
        actions: [
          ...(paymentActions?.actions || []),
          {
            action,
            name: 'associatedDocs',
            value: JSON.stringify(associatedDocs)
          }
        ]
      };
    }

    return paymentActions;
  }

  private addPaymentDeliveryRelation(delivery: IFormatDelivery, amount: number, isPartial: boolean): IAssociatedDocsForPayments {
    return removeUndefinedValues<IAssociatedDocsForPayments>({
      documentId: delivery.key,
      dteType: delivery.custom?.fields?.dteType,
      dteNumber: delivery.custom?.fields?.dteNumber,
      dteDate: delivery.custom?.fields?.dteDate,
      sapDocumentId: delivery.custom?.fields?.sapDocumentId,
      amount,
      isPartial
    });
  }

  private addPaymentCreditNotesRelation(creditNote: CustomObject, amount: number, isPartial: boolean): IAssociatedDocsForCreditNotes {
    return removeUndefinedValues<IAssociatedDocsForCreditNotes>({
      documentId: creditNote.value?.documentId,
      dteType: creditNote.value?.dteType ?? 'NTC',
      dteNumber: creditNote.value?.dteNumber,
      dteDate: creditNote.value?.dteDate,
      amount,
      isPartial
    });
  }

  private setSalesRepRut(paymentActions: IPaymentActions[string], salesRepRUT: string): IPaymentActions[string] {
    return {
      ...paymentActions,
      actions: [
        ...(paymentActions?.actions || []),
        {
          action: 'setCustomField',
          name: 'salesRepRUT',
          value: salesRepRUT
        }
      ]
    };
  }
  private setCollectedBy(paymentActions: IPaymentActions[string], username: string): IPaymentActions[string] {
    return {
      ...paymentActions,
      actions: [
        ...(paymentActions?.actions || []),
        {
          action: 'setCustomField',
          name: 'collectedBy',
          value: username
        }
      ]
    };
  }

  private getPaymentsPendingAndPaids(paymentInfo: Payment[]): IGetPaymentsPendingAndPaids {
    const paymentsPaids: string[] = [];
    const paymentsPending: IPaymentCancelled[] = [];
    paymentInfo.forEach((payment: Payment) => {
      if (payment.paymentStatus.state?.obj?.key === KEY_PAYMENT_STATE.PENDING) {
        paymentsPending.push({
          id: payment.id,
          version: payment.version
        });
      }
      if (payment.paymentStatus.state?.obj?.key === KEY_PAYMENT_STATE.PAID) {
        paymentsPaids.push(payment.id);
      }
    });

    return { paymentsPaids, paymentsPending };
  }

  private async createPayment({ centAmount, payment, businessUnitId, paymentState }: ICreatePayment): Promise<Payment> {
    return this.paymentsService.create({
      amountPlanned: {
        centAmount,
        currencyCode: 'CLP'
      },
      paymentStatus: {
        state: {
          typeId: 'state',
          key: paymentState || KEY_PAYMENT_STATE.PENDING
        }
      },
      paymentMethodInfo: {
        method: payment.method
      },
      custom: {
        type: {
          typeId: 'type',
          key: 'adelco-payment-type'
        },
        fields: {
          ...(payment &&
            removeUndefinedValues({
              checkExpirationDate: payment.checkExpirationDate,
              checkNumber: payment.checkNumber,
              transferNumber: payment.transferNumber,
              trxNumber: payment.trxNumber,
              accountNumber: payment.accountNumber,
              bankCode: payment.bankCode
            })),
          businessUnitId
        }
      }
    });
  }
}

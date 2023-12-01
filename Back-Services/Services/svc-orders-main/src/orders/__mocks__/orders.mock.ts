import { AdelcoOrder } from '@adelco/price-calc';
import { Order, OrderFromCartDraft } from '@commercetools/platform-sdk';
import { UpdatePaymentDtoRequest } from '../dto/update-payment.dto';
import { PAYMENT_CONDITION, PAYMENT_METHOD, PAYMENT_STATUS } from '@/payments/enum/payment.enum';
import { UpdateDeliveriesDtoRequest } from '../dto/update-deliveries.dto';
import { DELIVERY_STATUS } from '../enum/orders.enum';
import { COMPANY_BLOCKED } from '@/business-unit/constants';

export const mockOrderResponse: Order = {
  paymentInfo: {
    payments: [
      {
        id: '85f70fc1-47fc-4bd5-bf29-48daf2387625',
        obj: {
          id: '85f70fc1-47fc-4bd5-bf29-48daf2387625',
          version: 1
        }
      } as any
    ]
  },
  id: '1549bce5-1190-4e75-9176-3fd9a481ce90',
  version: 1,
  lastMessageSequenceNumber: 1,
  createdAt: '2023-07-14T12:51:08.273Z',
  lastModifiedAt: '2023-07-14T12:51:08.273Z',
  orderNumber: '0000000001',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'CLP',
    centAmount: 1198,
    fractionDigits: 0
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 1198,
      fractionDigits: 0
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 1546,
      fractionDigits: 0
    },
    taxPortions: [
      {
        rate: 0.1,
        amount: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 120,
          fractionDigits: 0
        },
        name: 'Imp Beb Analc'
      },
      {
        rate: 0.19,
        amount: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 228,
          fractionDigits: 0
        },
        name: 'IVA'
      }
    ],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 348,
      fractionDigits: 0
    }
  },
  orderState: 'Open',
  shipmentState: 'Pending',
  paymentState: 'Pending',
  syncInfo: [],
  returnInfo: [],
  taxMode: 'External',
  inventoryMode: 'ReserveOnOrder',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  origin: 'Customer',
  shippingMode: 'Single',
  shippingInfo: {
    shippingMethodName: 'default',
    price: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 0,
      fractionDigits: 0
    },
    shippingRate: {
      price: {
        type: 'centPrecision',
        currencyCode: 'CLP',
        centAmount: 0,
        fractionDigits: 0
      },
      tiers: []
    },
    taxRate: {
      name: 'noTax',
      amount: 0,
      includedInPrice: false,
      country: 'CL',
      subRates: []
    },
    deliveries: [
      {
        id: 'deliveryId',
        key: 'documentId',
        createdAt: '2023-08-01T13:25:14.177Z',
        items: [
          {
            id: 'item1',
            quantity: 100
          },
          {
            id: 'item2',
            quantity: 5
          },
          {
            id: 'item3',
            quantity: 20
          }
        ],
        parcels: [],
        custom: {
          type: {
            typeId: 'type',
            id: 'f4724ed6-010a-470d-8eb1-fadf3011d9c0'
          },
          fields: {
            positionsMapping: '[{"id":"item1","pos":"10"},{"id":"item2","pos":"20"}]',
            state: 'Pending',
            truckDriverId: 'sales',
            transportDocumentId: 'transportDocumentId',
            owedAmount: {
              centAmount: 123123,
              currencyCode: 'CLP'
            },
            dteType: 'dteType',
            dteNumber: 'dteNumber',
            dteDate: 'dteDate',
            sapDocumentId: 'sapDocumentId',
            carrierRUT: 'carrierRUT'
          }
        }
      }
    ],
    shippingMethod: {
      typeId: 'shipping-method',
      id: '4d3480d5-d787-4d68-ba06-c70bb5caf045'
    },
    taxedPrice: {
      totalNet: {
        type: 'centPrecision',
        currencyCode: 'CLP',
        centAmount: 0,
        fractionDigits: 0
      },
      totalGross: {
        type: 'centPrecision',
        currencyCode: 'CLP',
        centAmount: 0,
        fractionDigits: 0
      },
      totalTax: {
        type: 'centPrecision',
        currencyCode: 'CLP',
        centAmount: 0,
        fractionDigits: 0
      }
    },
    shippingMethodState: 'MatchesCart'
  },
  shippingAddress: {
    streetName: 'Carmen Larrain',
    city: 'chimbarongo',
    region: 'del-libertador-b-o-higgins',
    country: 'CL',
    department: 'chimbarongo',
    key: 'shipping-address'
  },
  shipping: [],
  lineItems: [
    {
      id: 'item1',
      productId: '4e40e240-1549-4000-9d51-2862546a0337',
      productKey: 'prod-adelco-145211',
      name: {
        'es-CL': 'COMINO EN POLVO'
      },
      productType: {
        typeId: 'product-type',
        id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
      },
      productSlug: {
        'es-CL': 'comino-en-polvo-145211'
      },
      variant: {
        id: 1,
        sku: '145211',
        key: 'var-adelco-145211',
        prices: [],
        images: [],
        attributes: [
          {
            name: 'enabledForDistributionCenters',
            value: [
              {
                key: 'LB',
                label: 'Lo Boza'
              },
              {
                key: 'PM',
                label: 'Pto Montt'
              }
            ]
          },
          {
            name: 'sellUnit',
            value: {
              key: 'DSP',
              label: 'DISPLAY'
            }
          },
          {
            name: 'brand',
            value: 'SURCO'
          },
          {
            name: 'netContent',
            value: '250GR'
          },
          {
            name: 'netWeight',
            value: 1.04
          },
          {
            name: 'grossWeight',
            value: 1.04
          },
          {
            name: 'weightUnit',
            value: 'kg'
          },
          {
            name: 'volume',
            value: 0.003
          },
          {
            name: 'volumeUnit',
            value: 'm3'
          },
          {
            name: 'height',
            value: 1
          },
          {
            name: 'company',
            value: {
              key: '2',
              label: 'Proveedores'
            }
          },
          {
            name: 'heightUnit',
            value: 'cm'
          },
          {
            name: 'operationalUnit',
            value: '100'
          },
          {
            name: 'operationalUnitQuantity',
            value: 1
          },
          {
            name: 'operationalUnitPerBox',
            value: 12
          },
          {
            name: 'operationalUnitWeight',
            value: 1
          },
          {
            name: 'operationalUnitWeightUnit',
            value: 'kg'
          },
          {
            name: 'EAN',
            value: '7804520024026'
          },
          {
            name: 'DUN',
            value: '17804520024023'
          },
          {
            name: 'dangerousGoodsCode',
            value: {
              key: '017',
              label: 'N/A'
            }
          },
          {
            name: 'provider',
            value: '0300000018'
          },
          {
            name: 'sapId',
            value: '145211'
          },
          {
            name: 'sortingPriority',
            value: 0
          },
          {
            name: 'price',
            value: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 1234,
              fractionDigits: 0
            }
          }
        ],
        assets: [],
        availability: {
          channels: {
            '8049dec8-e2c8-4787-8a9a-3683b1d8d009': {
              isOnStock: false,
              availableQuantity: 0,
              version: 401,
              id: '832a9b7f-3e33-4cd6-8900-49c1761e45a0'
            },
            '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
              isOnStock: true,
              availableQuantity: 993,
              version: 9,
              id: '2759b715-7ad8-490e-8ca4-fb1ca740ad7d'
            }
          }
        }
      },
      price: {
        id: '9b914501-6da3-437d-801a-921eb2ff2fa6',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 1198,
          fractionDigits: 0
        }
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      supplyChannel: {
        typeId: 'channel',
        id: '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1'
      },
      taxRate: {
        name: 'IVA + Imp Beb Analc',
        amount: 0.29,
        includedInPrice: false,
        country: 'CL',
        subRates: [
          {
            name: 'IVA',
            amount: 0.19
          },
          {
            name: 'Imp Beb Analc',
            amount: 0.1
          }
        ]
      },
      perMethodTaxRate: [],
      addedAt: '2023-07-14T12:47:58.913Z',
      lastModifiedAt: '2023-07-14T12:47:58.913Z',
      state: [
        {
          quantity: 125,
          state: {
            typeId: 'state',
            id: 'shipped'
          }
        }
      ],
      priceMode: 'ExternalPrice',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'CLP',
        centAmount: 1198,
        fractionDigits: 0
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 1198,
          fractionDigits: 0
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 1545,
          fractionDigits: 0
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 347,
          fractionDigits: 0
        }
      },
      taxedPricePortions: [],
      custom: {
        type: {
          typeId: 'type',
          id: '6f9151e9-9804-4a89-aaea-d19797641151'
        },
        fields: {
          productDiscount: '{"description":"test xema product","discountRate":10,"discountedAmount":134,"includedInPrice":true}'
        }
      }
    }
  ],
  customLineItems: [],
  discountCodes: [],
  cart: {
    typeId: 'cart',
    id: '8f30b00b-940c-4616-b65a-66c0511e2cf7'
  },
  custom: {
    type: {
      typeId: 'type',
      id: '4f020df8-5847-46ef-83eb-3c0f5ed54429'
    },
    fields: {
      createdBy: 'mmazzucco@dminc.com'
    }
  },
  itemShippingAddresses: [],
  refusedGifts: [],
  businessUnit: {
    typeId: 'business-unit',
    key: 'pritty'
  }
};

export const mockOrderBlockedByCreditResponse: Order = {
  ...mockOrderResponse,
  custom: {
    ...mockOrderResponse.custom,
    fields: {
      ...mockOrderResponse.custom.fields,
      creditBlockedReason: COMPANY_BLOCKED
    }
  }
};

export const mockOrderWithMorePendingDeliveries: Order = {
  ...mockOrderResponse,
  shippingInfo: {
    ...mockOrderResponse.shippingInfo,
    deliveries: [
      ...mockOrderResponse.shippingInfo.deliveries,
      {
        id: '12',
        createdAt: '',
        parcels: [],
        items: [],
        custom: {
          type: {
            typeId: 'type',
            id: ''
          },
          fields: {}
        }
      }
    ]
  }
};

export const mockAdelcoOrder: AdelcoOrder = {
  ...mockOrderResponse,
  lineItems: [
    {
      ...mockOrderResponse.lineItems[0],
      lineDetails: {
        lineSubtotalPrice: 1332,
        discounts: [
          {
            description: 'test xema product',
            amount: 134
          }
        ],
        lineNetPrice: 1198,
        taxes: [
          {
            description: 'IVA',
            amount: 228
          },
          {
            description: 'Imp Beb Analc',
            amount: 120
          }
        ],
        lineGrossPrice: 1546,
        unitPrice: 1546,
        discountRate: 10
      }
    }
  ],
  totalDetails: {
    subtotalPrice: 1332,
    discounts: [
      {
        description: 'test xema product',
        amount: 134
      }
    ],
    netPrice: 1198,
    taxes: [
      {
        description: 'IVA',
        amount: 228
      },
      {
        description: 'Imp Beb Analc',
        amount: 120
      }
    ],
    grossPrice: 1546
  }
};

export const mockAdelcoOrderWithCartUpdatesOrder: AdelcoOrder = {
  ...mockAdelcoOrder,
  cartUpdates: {
    isPriceUpdated: true,
    isQuantityUpdated: true
  }
};

export const mockOrderFromCartDraft: OrderFromCartDraft = {
  cart: {
    typeId: 'cart',
    id: '8f30b00b-940c-4616-b65a-66c0511e2cf7'
  },
  version: 1,
  orderNumber: '0000000001',
  paymentState: 'Pending',
  shipmentState: 'Pending'
};

export const mockOrderBlockedByCreditFromCartDraft: OrderFromCartDraft = {
  ...mockOrderFromCartDraft,
  paymentState: 'blockedByCredit'
};

export const mockUpdatePaymentRequest: UpdatePaymentDtoRequest = {
  businessUnitId: 'businessunitid',
  deliveryId: 'deliveryId',
  documentId: 'dteNumber',
  paymentId: '85f70fc1-47fc-4bd5-bf29-48daf2387625',
  condition: PAYMENT_CONDITION.CASH,
  method: PAYMENT_METHOD.CASH,
  extraInfo: 'extra info',
  status: PAYMENT_STATUS.PAID,
  amountPaid: 123123,
  transferNumber: 'transferNumber',
  checkNumber: 'checkNumber',
  trxNumber: 'trxNumber',
  bankCode: 'bankCode',
  accountNumber: 'accountNumber',
  checkExpirationDate: '2023-08-28T00:00:00Z'
};

export const mockupdateDeliveriesRequest: UpdateDeliveriesDtoRequest = {
  businessUnitId: 'id',
  deliveryId: 'deliveryId',
  documentId: 'documentId',
  transportDocumentId: 'transportDocumentId',
  date: new Date('2023-08-10').toISOString(),
  status: DELIVERY_STATUS.PARTIAL,
  noDeliveryReason: '513',
  noDeliveredItems: [
    {
      lineItemCtId: 'item1',
      quantity: 50
    },
    {
      lineItemCtId: 'item2',
      quantity: 5
    }
  ],
  deliveryCoordinates: {
    lat: 123,
    long: 123
  },
  newDeliveryTotal: {
    totalGross: 2,
    totalNet: 1,
    totalTax: 1
  }
};

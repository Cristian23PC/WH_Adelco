import { Cart } from '@commercetools/platform-sdk';

export const mockCartResponse: Cart = {
  id: '7098b079-83fb-4c62-906a-f5836a3fe5a7',
  version: 8,
  createdAt: '2023-07-17T16:04:31.891Z',
  lastModifiedAt: '2023-07-17T16:43:41.376Z',
  lineItems: [
    {
      id: '91d70604-1d60-4d64-8cc4-d2d5f54906cb',
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
              availableQuantity: 992,
              version: 11,
              id: '2759b715-7ad8-490e-8ca4-fb1ca740ad7d'
            }
          }
        }
      },
      price: {
        id: 'f1e0b054-1e9c-4457-833b-e5e2747cef80',
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
      addedAt: '2023-07-17T16:04:31.880Z',
      lastModifiedAt: '2023-07-17T16:04:31.880Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: 'fc9b8f5d-0342-47e7-bdaa-ba0368e801d4'
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
          t2UnitAmount: 10,
          productDiscount: '{"description":"test xema product","discountRate":10,"discountedAmount":134,"includedInPrice":true, "key":"2023-Black-friday-01__ZD13__AGREE123"}'
        }
      }
    }
  ],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'CLP',
    centAmount: 1198,
    fractionDigits: 0
  },
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
    deliveries: [],
    shippingMethod: {
      typeId: 'shipping-method',
      id: 'a602b411-6f4a-4701-b3d2-a474f2ec344e'
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
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  custom: {
    type: {
      typeId: 'type',
      id: '4f020df8-5847-46ef-83eb-3c0f5ed54429'
    },
    fields: {
      createdBy: 'mmazzucco@dminc.com'
    }
  },
  paymentInfo: {
    payments: [
      {
        typeId: 'payment',
        id: 'd99da380-2f3f-4abf-8ebe-dfcee666966c'
      }
    ]
  },
  inventoryMode: 'ReserveOnOrder',
  taxMode: 'External',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  deleteDaysAfterLastModification: 90,
  refusedGifts: [],
  origin: 'Customer',
  itemShippingAddresses: [],
  businessUnit: {
    typeId: 'business-unit',
    key: 'pritty'
  },
  totalLineItemQuantity: 1
};

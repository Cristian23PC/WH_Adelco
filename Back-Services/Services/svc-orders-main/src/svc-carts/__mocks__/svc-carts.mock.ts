import { ECOMM_SOURCE_CUSTOM_FIELD } from '@/common/constants/carts';
import { IGetActiveCartResponse } from '../svc-carts.interface';
import { DeliveryDatesResponse } from '@adelco/lib_delivery/lib/es5/interfaces/delivery-dates.interface';

export const mockGetActiveCart: IGetActiveCartResponse = {
  id: '8f30b00b-940c-4616-b65a-66c0511e2cf7',
  version: 1,
  createdAt: '2023-07-14T12:47:58.928Z',
  lastModifiedAt: '2023-07-14T12:47:58.928Z',
  lineItems: [
    {
      id: '699327ad-2fc4-4a7e-a5a2-7ca8d7c952ca',
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
          productDiscount: '{"description":"test xema product","discountRate":10,"discountedAmount":134,"includedInPrice":true}',
          source: ECOMM_SOURCE_CUSTOM_FIELD
        }
      },
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
        discountRate: 11
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
  totalLineItemQuantity: 1,
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
  },
  isCartAdjusted: false
};

export const mockGetActiveWithCartUpdatesCart: IGetActiveCartResponse = {
  ...mockGetActiveCart,
  cartUpdates: {
    isPriceUpdated: true,
    isQuantityUpdated: true
  }
};

export const mockGetNextDeliveryDates: DeliveryDatesResponse = {
  deliveryDates: [
    {
      startDateTime: '2023-08-29T15:30:00Z',
      endDateTime: '2023-08-29T15:30:00Z'
    }
  ]
};

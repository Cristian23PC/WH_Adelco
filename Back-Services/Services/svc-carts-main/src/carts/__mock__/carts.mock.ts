import { Cart, LineItem } from '@commercetools/platform-sdk';
import { AdelcoCart } from '@adelco/price-calc';

export const mockCommercetoolsErrorMalformed = {
  statusCode: 400,
  message: `Malformed parameter: where: Syntax error while parsing 'where'. Unexpected end of input, expected SphereIdentifierChar, comparison operator, not, in, contains, is, within or matches (line 1, column 8):invalid`,
  errors: [
    {
      code: 'InvalidInput',
      message: `Malformed parameter: where: Syntax error while parsing 'where'. Unexpected end of input, expected SphereIdentifierChar, comparison operator, not, in, contains, is, within or matches (line 1, column 8):invalid`
    }
  ]
};

export const mockCommercetoolsErrorNotFound = {
  statusCode: 404,
  message: `Not Found`
};

export const mockCommercetoolsCartResponse: Cart = {
  id: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
  version: 1,
  createdAt: '2023-04-06T14:47:38.837Z',
  lastModifiedAt: '2023-04-06T14:47:38.837Z',
  lineItems: [],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 0,
    fractionDigits: 2
  },
  shippingMode: 'Single',
  shipping: [],
  customLineItems: [],
  discountCodes: [
    {
      discountCode: {
        obj: {
          code: 'code-to-remove',
          version: 0,
          createdAt: '',
          lastModifiedAt: '',
          cartDiscounts: [],
          isActive: false,
          references: [],
          groups: [],
          id: 'discount-code-id'
        },
        typeId: 'discount-code',
        id: 'discount-code-id'
      },
      state: ''
    }
  ],
  directDiscounts: [],
  inventoryMode: 'None',
  taxMode: 'Platform',
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
  custom: {
    type: {
      typeId: 'type',
      id: 'cart-type'
    },
    fields: {
      createdBy: 'username@username.com',
      deliveryZone: {
        typeId: 'key-value-document',
        id: 'delivery-zone-id',
        obj: {
          id: 'delivery-zone-id',
          version: 11,
          versionModifiedAt: '2023-09-01T18:17:36.779Z',
          createdAt: '2023-03-16T21:18:15.567Z',
          lastModifiedAt: '2023-09-01T18:17:36.779Z',
          lastModifiedBy: {
            clientId: 'MwS_8ijaCbz-LVmNJdfXVOTP',
            isPlatformClient: false
          },
          createdBy: {
            clientId: 'WsMSbaR8Ae4dZYWfpAhfF2Lm',
            isPlatformClient: false
          },
          container: 'delivery-zone',
          key: 'algarrobo',
          value: {
            deliveryZoneCode: 'N201',
            regionCode: '05',
            label: 'Algarrobo',
            t2Rate: '0.075',
            commune: 'algarrobo',
            dcCode: '1800',
            defaultSalesBranch: '50',
            dcLabel: 'Lo Boza',
            cutoffTime: ['16:00'],
            deliveryDays: [1, 3, 5],
            deliveryRange: 0,
            preparationTime: 1,
            frequency: 'W',
            isAvailable: true,
            method: 'Delivery'
          }
        }
      },
      lastVerificationTime: '2023-09-13T10:14:22.329Z'
    }
  }
};

export const mockCommercetoolsCartWithDeliveryZoneResponse: Cart = {
  ...mockCommercetoolsCartResponse,
  custom: {
    ...mockCommercetoolsCartResponse.custom,
    fields: {
      ...mockCommercetoolsCartResponse.custom.fields,
      deliveryZone: { typeId: 'key-reference', id: 'delivery-zone-id', obj: { key: 'delivery-zone-key', value: { dcCode: 'key' } } }
    }
  }
};

export const mockAdelcoCartResponse: AdelcoCart = {
  ...mockCommercetoolsCartResponse,
  totalDetails: {
    discounts: [],
    grossPrice: 0,
    netPrice: 0,
    subtotalPrice: 0,
    taxes: []
  }
};

export const mockAdelcoCartWithCartUpdatesResponse: AdelcoCart = {
  ...mockAdelcoCartResponse,
  cartUpdates: {
    isQuantityUpdated: true,
    isPriceUpdated: true
  }
};

export const mockAdelcoCartWithDeliveryZoneResponse: AdelcoCart = {
  ...mockCommercetoolsCartWithDeliveryZoneResponse,
  totalDetails: {
    discounts: [],
    grossPrice: 0,
    netPrice: 0,
    subtotalPrice: 0,
    taxes: []
  }
};

export const mockCommercetoolsCartWithLineItemResponse = {
  ...mockCommercetoolsCartResponse,
  lineItems: [
    {
      id: 'lineItem-id',
      productId: '',
      name: undefined,
      productType: undefined,
      variant: {},
      price: {
        id: 'line-item-price-id',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          fractionDigits: 5,
          centAmount: 100
        }
      },
      quantity: 0,
      totalPrice: undefined,
      discountedPricePerQuantity: [],
      taxedPricePortions: [],
      state: [],
      perMethodTaxRate: [],
      priceMode: '',
      lineItemMode: ''
    }
  ] as LineItem[]
};

export const mockCommercetoolsCartWithLineItemVariantAndCustomFieldsResponse = {
  ...mockCommercetoolsCartWithLineItemResponse,
  lineItems: [
    {
      ...mockCommercetoolsCartWithLineItemResponse.lineItems[0],
      variant: {
        id: 'id',
        sku: 'sku1',
        availability: { channels: { channelId: { isOnStock: true, availableQuantity: 100 } } },
        price: {
          value: {
            centAmount: 10,
            currency: 'CLP',
            fractionDigits: 0
          }
        }
      }
    }
  ],
  custom: mockCommercetoolsCartWithDeliveryZoneResponse.custom
};

export const mockCommercetoolsCartWithLineItemAndDeliveryZoneCustomFieldResponse: Cart = {
  ...mockCommercetoolsCartWithLineItemResponse,
  custom: {
    type: {
      typeId: 'type',
      id: 'cart-type'
    },
    fields: {
      deliveryZone: {
        typeId: 'type',
        id: 'delivery-zone-id',
        obj: {
          key: 'deliveryZoneKey',
          value: {
            dcCode: 'dcCode'
          }
        }
      }
    }
  }
};

export const mockCommercetoolsCartWithMissingDeliveryZoneMissingDataResponse = {
  ...mockCommercetoolsCartWithLineItemResponse,
  custom: {
    type: {
      typeId: 'type',
      id: 'cart-type'
    },
    fields: {
      deliveryZone: {
        typeId: 'type',
        id: 'cart-type',
        obj: {
          key: 'delivery-zone-missing-data-id'
        }
      }
    }
  }
};

export const mockCommercetoolsCartWithUnableToDeterminateProductStockResponse = {
  ...mockCommercetoolsCartWithLineItemResponse,
  lineItems: [
    {
      ...mockCommercetoolsCartWithLineItemResponse.lineItems[0],
      variant: {
        id: 'id',
        sku: 'sku1',
        availability: { channels: { anotherChannelId: { isOnStock: true, availableQuantity: 100 } } },
        price: {
          value: {
            centAmount: 10,
            currency: 'CLP',
            fractionDigits: 0
          }
        }
      }
    }
  ],
  custom: mockCommercetoolsCartWithDeliveryZoneResponse.custom
};

export const mockCommercetoolsCartWithNoProductStockResponse = {
  ...mockCommercetoolsCartWithLineItemResponse,
  lineItems: [
    {
      ...mockCommercetoolsCartWithLineItemResponse.lineItems[0],
      variant: {
        id: 'id',
        sku: 'sku1',
        availability: { channels: { channelId: { isOnStock: false, availableQuantity: 100 } } },
        price: {
          value: {
            centAmount: 10,
            currency: 'CLP',
            fractionDigits: 0
          }
        }
      }
    }
  ],
  custom: mockCommercetoolsCartWithDeliveryZoneResponse.custom
};

export const mockLineItem: LineItem = {
  id: '4bcdaaf2-6d5a-4377-9a70-77fc3e4bf428',
  productId: '8c8042d1-d5ed-471a-8a7c-85055d7e0153',
  productKey: 'prod-adelco-161187',
  name: {
    'es-CL': 'PROTECTOR SOLAR CREMA SPF50+PANTALLA'
  },
  productType: {
    typeId: 'product-type',
    id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
  },
  productSlug: {
    'es-CL': 'protector-solar-crema-spf50-pantalla-161187'
  },
  variant: {
    id: 1,
    sku: '161187',
    key: 'var-adelco-161187',
    prices: [],
    images: [
      {
        url: 'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-QvKP64GP.png',
        dimensions: {
          w: 1000,
          h: 1000
        }
      }
    ],
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
          key: 'CJ',
          label: 'CAJA'
        }
      },
      {
        name: 'brand',
        value: 'SIMONDS'
      },
      {
        name: 'netContent',
        value: '200GR'
      },
      {
        name: 'netWeight',
        value: 2.869
      },
      {
        name: 'grossWeight',
        value: 2.869
      },
      {
        name: 'weightUnit',
        value: 'kg'
      },
      {
        name: 'volume',
        value: 0.006
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
        value: '17804945015835'
      },
      {
        name: 'DUN',
        value: '17804945015835'
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
        value: '0100001727'
      },
      {
        name: 'sapId',
        value: '161187'
      },
      {
        name: 'sortingPriority',
        value: 50
      },
      {
        name: 'price',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 49374,
          fractionDigits: 0
        }
      }
    ],
    assets: [],
    availability: {
      channels: {
        '8049dec8-e2c8-4787-8a9a-3683b1d8d009': {
          isOnStock: true,
          availableQuantity: 61,
          version: 652,
          id: '6f8eaa75-9517-464e-88f6-7cd1b4c04ff9'
        },
        '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
          isOnStock: true,
          availableQuantity: 998,
          version: 1,
          id: 'c0c27b1e-12a4-4b97-a595-f5ddaf2ee0bb'
        }
      }
    }
  },
  price: {
    id: '677b1183-fc96-4f27-b6cb-1e6017affa7d',
    value: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 53324,
      fractionDigits: 0
    }
  },
  quantity: 1,
  discountedPricePerQuantity: [],
  taxRate: {
    name: 'IVA + Imp Harinas',
    amount: 0.31,
    includedInPrice: false,
    country: 'CL',
    subRates: [
      {
        name: 'IVA',
        amount: 0.19
      },
      {
        name: 'Imp Harinas',
        amount: 0.12
      }
    ]
  },
  perMethodTaxRate: [],
  addedAt: '2023-06-22T15:35:10.905Z',
  lastModifiedAt: '2023-06-22T15:35:10.905Z',
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
    centAmount: 53324,
    fractionDigits: 0
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 53324,
      fractionDigits: 0
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 69854,
      fractionDigits: 0
    },
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 16530,
      fractionDigits: 0
    }
  },
  taxedPricePortions: []
};

export const mockLineItemsDraft = [{ sku: 'sku', quantity: 4 }];

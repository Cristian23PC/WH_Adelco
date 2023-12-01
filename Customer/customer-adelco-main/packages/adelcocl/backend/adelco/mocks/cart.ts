export default {
  type: 'Cart',
  id: '63dba29e-7b22-4ebf-bbca-374b2b0f3b3a',
  version: 159,
  versionModifiedAt: '2023-05-22T10:33:36.679Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2023-05-15T16:58:21.174Z',
  lastModifiedAt: '2023-05-22T10:33:36.679Z',
  lastModifiedBy: {
    clientId: 'AW0W3CLbcEUEsxMRuAcoY73c',
    isPlatformClient: false
  },
  createdBy: {
    clientId: 'AW0W3CLbcEUEsxMRuAcoY73c',
    isPlatformClient: false
  },
  lineItems: [
    {
      id: '2ecf6cfc-4832-405c-9647-d306a4d0ac3f',
      productId: '61a6947e-2ac7-401b-a2ef-97c8a6ed75fb',
      productKey: 'prod-adelco-101923',
      name: {
        'es-CL': 'ATUN DESMENU ACEITE PK GRUMETE 8X6X170GR'
      },
      productType: {
        typeId: 'product-type',
        id: '0d99f336-55cc-4b01-b6b4-c40d2970f579',
        version: 8
      },
      productSlug: {
        'es-CL': 'atun-desmenu-aceite-pk-grumete-8x6x170gr-101923'
      },
      variant: {
        id: 1,
        sku: '101923',
        key: 'var-adelco-101923',
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
            value: 'GRUMETE'
          },
          {
            name: 'netContent',
            value: '170GR'
          },
          {
            name: 'netWeight',
            value: 1.02
          },
          {
            name: 'grossWeight',
            value: 1.02
          },
          {
            name: 'weightUnit',
            value: 'kg'
          },
          {
            name: 'volume',
            value: 0.002
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
            value: 48
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
            value: '7804520988755'
          },
          {
            name: 'DUN',
            value: '17804520988752'
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
            value: '0200000038'
          },
          {
            name: 'sapId',
            value: '101923'
          },
          {
            name: 'sortingPriority',
            value: 0
          }
        ],
        assets: [],
        availability: {
          channels: {
            '67ade61e-19f0-421c-941f-25555d693973': {
              isOnStock: true,
              availableQuantity: 300,
              version: 1,
              id: 'e3ea9bd8-36a8-41c4-be9e-f1a7123a12a8'
            },
            '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
              isOnStock: true,
              availableQuantity: 200,
              version: 1,
              id: '73bdc2e4-bc0e-4a4a-8071-e40847bcc777'
            }
          }
        }
      },
      price: {
        id: '16b07968-5af0-4f5e-a60b-f0bdb3da3bed',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 14580,
          fractionDigits: 0
        }
      },
      quantity: 40,
      discountedPricePerQuantity: [],
      taxRate: {
        name: 'IVA',
        amount: 0.19,
        includedInPrice: false,
        country: 'CL',
        subRates: [
          {
            name: 'IVA',
            amount: 0.19
          }
        ]
      },
      perMethodTaxRate: [],
      addedAt: '2023-05-20T02:00:53.764Z',
      lastModifiedAt: '2023-05-22T07:38:14.441Z',
      state: [
        {
          quantity: 40,
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
        centAmount: 583200,
        fractionDigits: 0
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 583200,
          fractionDigits: 0
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 694008,
          fractionDigits: 0
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 110808,
          fractionDigits: 0
        }
      },
      taxedPricePortions: [],
      lineDetails: {
        lineSubtotalPrice: 583200,
        discounts: [],
        lineNetPrice: 583200,
        taxes: [
          {
            description: 'IVA',
            amount: 110808
          }
        ],
        lineGrossPrice: 694008,
        unitPrice: 17350,
        discountRate: 35
      }
    },
    {
      id: '08d9b327-85a9-4444-99a2-9cc3d9166675',
      productId: '09cbc67d-8a11-4b46-9dee-afb351306f03',
      productKey: 'prod-adelco-204030',
      name: {
        'es-CL': 'ESENCIA VAINILLA'
      },
      productType: {
        typeId: 'product-type',
        id: '0d99f336-55cc-4b01-b6b4-c40d2970f579',
        version: 8
      },
      productSlug: {
        'es-CL': 'esencia-vainilla-204030'
      },
      variant: {
        id: 1,
        sku: '204030',
        key: 'var-adelco-204030',
        prices: [],
        images: [
          {
            url: 'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-6IlLbvVA.png',
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
            value: '60ML'
          },
          {
            name: 'netWeight',
            value: 0.91
          },
          {
            name: 'grossWeight',
            value: 0.91
          },
          {
            name: 'weightUnit',
            value: 'kg'
          },
          {
            name: 'volume',
            value: 0.002
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
            value: 72
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
            value: '7804520010760'
          },
          {
            name: 'DUN',
            value: '78045200107532'
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
            value: '204030'
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
              centAmount: 7992,
              fractionDigits: 0
            }
          }
        ],
        assets: []
      },
      price: {
        id: '8edafa7f-7cec-47f0-bcea-f573af33ec2a',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 666,
          fractionDigits: 0
        }
      },
      quantity: 21,
      discountedPricePerQuantity: [],
      supplyChannel: {
        typeId: 'channel',
        id: '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1'
      },
      taxRate: {
        name: 'IVA',
        amount: 0.19,
        includedInPrice: false,
        country: 'CL',
        subRates: [
          {
            name: 'IVA',
            amount: 0.19
          }
        ]
      },
      perMethodTaxRate: [],
      addedAt: '2023-05-22T10:33:36.664Z',
      lastModifiedAt: '2023-05-22T10:33:36.664Z',
      state: [
        {
          quantity: 21,
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
        centAmount: 13986,
        fractionDigits: 0
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 13986,
          fractionDigits: 0
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 16643,
          fractionDigits: 0
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 2657,
          fractionDigits: 0
        }
      },
      taxedPricePortions: [],
      lineDetails: {
        lineSubtotalPrice: 13986,
        discounts: [],
        lineNetPrice: 13986,
        taxes: [
          {
            description: 'IVA',
            amount: 2657
          }
        ],
        lineGrossPrice: 16643,
        unitPrice: 793,
        discountRate: 0
      }
    }
  ],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'CLP',
    centAmount: 597186,
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
      createdBy: 'johndoe@mail.com'
    }
  },
  inventoryMode: 'None',
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
  totalLineItemQuantity: 61,
  totalDetails: {
    subtotalPrice: 597186,
    discounts: [],
    netPrice: 597186,
    taxes: [
      {
        description: 'IVA',
        amount: 113465
      }
    ],
    grossPrice: 710651
  }
};

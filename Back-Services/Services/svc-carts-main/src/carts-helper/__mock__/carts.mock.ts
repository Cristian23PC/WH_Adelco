import { Cart } from '@commercetools/platform-sdk';

export const mockCommercetoolsCartWithLastVerificationTimeResponse: Cart = {
  id: 'b7007430-d32b-47eb-803c-a351c8627705',
  version: 20,
  createdAt: '2023-09-11T15:29:44.612Z',
  lastModifiedAt: '2023-09-11T15:39:55.789Z',
  lastModifiedBy: {
    clientId: 'Q5NaMMSoXaIOm3u_bf2y9t3o'
  },
  createdBy: {
    clientId: '3kG0ULImcBITnBgS0ZJZJRbW'
  },
  lineItems: [
    {
      id: '856f58f9-5cd6-41a9-b572-b95497e6a738',
      productId: 'b91051ea-840c-4cfe-b91b-a2c7979ca9ef',
      productKey: 'prod-adelco-159182',
      name: {
        'es-CL': 'SHAMPOO RESTAURACIÓN'
      },
      productType: {
        typeId: 'product-type',
        id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
      },
      productSlug: {
        'es-CL': 'shampoo-restauraci-n-159182'
      },
      variant: {
        id: 1,
        sku: '159182',
        key: 'var-adelco-159182',
        prices: [],
        images: [
          {
            url: 'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-ll9x0-Op.png',
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
                key: '1300',
                label: 'Iquique'
              },
              {
                key: '1400',
                label: 'Antofagasta'
              },
              {
                key: '1500',
                label: 'Coquimbo'
              },
              {
                key: '1800',
                label: 'Lo Boza'
              },
              {
                key: '2300',
                label: 'Temuco'
              },
              {
                key: '2400',
                label: 'Osorno'
              },
              {
                key: '2500',
                label: 'Puerto Montt'
              },
              {
                key: '2700',
                label: 'Punta Arenas'
              },
              {
                key: '2900',
                label: 'Coyhaique (Ogana)'
              },
              {
                key: '5000',
                label: 'Sur Medio'
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
            value: 'PANTENE'
          },
          {
            name: 'netContent',
            value: '400ML'
          },
          {
            name: 'netWeight',
            value: 5.64
          },
          {
            name: 'grossWeight',
            value: 5.64
          },
          {
            name: 'weightUnit',
            value: 'kg'
          },
          {
            name: 'volume',
            value: 0.008
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
            value: '1X12X400ML'
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
            value: '17501006721130'
          },
          {
            name: 'DUN',
            value: 'N/A'
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
            value: '100001824'
          },
          {
            name: 'sapId',
            value: '159182'
          },
          {
            name: 'sortingPriority',
            value: 700
          },
          {
            name: 'price',
            value: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 30002,
              fractionDigits: 0
            }
          }
        ],
        assets: [],
        availability: {
          channels: {
            '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
              isOnStock: true,
              availableQuantity: 42,
              version: 47,
              id: 'be3c841f-c504-4ed7-9792-61c792419199'
            }
          }
        }
      },
      price: {
        id: '02bb6ad3-2e9d-4de9-b991-7f74880ad11e',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 32282,
          fractionDigits: 0
        }
      },
      quantity: 10,
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
      addedAt: '2023-09-11T15:29:44.603Z',
      lastModifiedAt: '2023-09-11T15:29:44.603Z',
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
        centAmount: 32282,
        fractionDigits: 0
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 32282,
          fractionDigits: 0
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 38416,
          fractionDigits: 0
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 6134,
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
          t2UnitAmount: 2280,
          sapPositions:
            '{"quantity":1,"position":10,"priceConditions":[{"sapCode":"ZT02","amount":2280,"currency":"CLP"},{"sapCode":"ZPRE","amount":30002,"currency":"CLP"},{"sapCode":"ZMWS","amount":6134,"currency":"CLP"}]}'
        }
      }
    },
    {
      id: '196cd997-4cac-4786-8bc9-3781fbd057f5',
      productId: 'aa16f59f-c258-4f5c-8825-ab36da37145d',
      productKey: 'prod-adelco-161160',
      name: {
        'es-CL': 'ACONDICIONADOR ACEITE COCO ARGAN'
      },
      productType: {
        typeId: 'product-type',
        id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
      },
      productSlug: {
        'es-CL': 'acondicionador-aceite-coco-argan-161160'
      },
      variant: {
        id: 1,
        sku: '161160',
        key: 'var-adelco-161160',
        prices: [],
        images: [
          {
            url: 'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-n32YaFES.png',
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
                key: '1300',
                label: 'Iquique'
              },
              {
                key: '1400',
                label: 'Antofagasta'
              },
              {
                key: '1500',
                label: 'Coquimbo'
              },
              {
                key: '1800',
                label: 'Lo Boza'
              },
              {
                key: '2300',
                label: 'Temuco'
              },
              {
                key: '2400',
                label: 'Osorno'
              },
              {
                key: '2500',
                label: 'Puerto Montt'
              },
              {
                key: '2700',
                label: 'Punta Arenas'
              },
              {
                key: '2900',
                label: 'Coyhaique (Ogana)'
              },
              {
                key: '5000',
                label: 'Sur Medio'
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
            value: 'FAMILAND'
          },
          {
            name: 'netContent',
            value: '750ML'
          },
          {
            name: 'netWeight',
            value: 10.078
          },
          {
            name: 'grossWeight',
            value: 10.078
          },
          {
            name: 'weightUnit',
            value: 'kg'
          },
          {
            name: 'volume',
            value: 0.017
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
            value: '1X12X750ML'
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
            value: '17804945063669'
          },
          {
            name: 'DUN',
            value: 'N/A'
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
            value: '100001727'
          },
          {
            name: 'sapId',
            value: '161160'
          },
          {
            name: 'sortingPriority',
            value: 430
          },
          {
            name: 'price',
            value: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 14300,
              fractionDigits: 0
            }
          }
        ],
        assets: [],
        availability: {
          channels: {
            '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
              isOnStock: true,
              availableQuantity: 42,
              version: 9,
              id: 'd0e41aae-4fc6-4485-a045-1effe9e708ba'
            }
          }
        }
      },
      price: {
        id: '80d17c7c-7652-4b77-b5eb-f10bc99f84ee',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 15387,
          fractionDigits: 0
        }
      },
      quantity: 10,
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
      addedAt: '2023-09-11T15:29:47.693Z',
      lastModifiedAt: '2023-09-11T15:29:47.693Z',
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
        centAmount: 15387,
        fractionDigits: 0
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 15387,
          fractionDigits: 0
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 18311,
          fractionDigits: 0
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 2924,
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
          t2UnitAmount: 1087,
          sapPositions:
            '{"quantity":1,"position":20,"priceConditions":[{"sapCode":"ZT02","amount":1087,"currency":"CLP"},{"sapCode":"ZPRE","amount":14300,"currency":"CLP"},{"sapCode":"ZMWS","amount":2924,"currency":"CLP"}]}'
        }
      }
    },
    {
      id: 'ec49d848-6c7c-4784-8999-20ca1ca86b88',
      productId: 'b79589f0-e3f9-4c2e-adea-f55713c9e9ab',
      productKey: 'prod-adelco-146889',
      name: {
        'es-CL': 'CLAVOS CORRIENTE 3 1/2 X9 BOLSA'
      },
      productType: {
        typeId: 'product-type',
        id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
      },
      productSlug: {
        'es-CL': 'clavos-corriente-3-1-2-x9-bolsa-146889'
      },
      variant: {
        id: 1,
        sku: '146889',
        key: 'var-adelco-146889',
        prices: [],
        images: [
          {
            url: 'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-QWWFgbpz.png',
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
                key: '1300',
                label: 'Iquique'
              },
              {
                key: '1400',
                label: 'Antofagasta'
              },
              {
                key: '1500',
                label: 'Coquimbo'
              },
              {
                key: '1800',
                label: 'Lo Boza'
              },
              {
                key: '2300',
                label: 'Temuco'
              },
              {
                key: '2400',
                label: 'Osorno'
              },
              {
                key: '2500',
                label: 'Puerto Montt'
              },
              {
                key: '2700',
                label: 'Punta Arenas'
              },
              {
                key: '2900',
                label: 'Coyhaique (Ogana)'
              },
              {
                key: '5000',
                label: 'Sur Medio'
              }
            ]
          },
          {
            name: 'sellUnit',
            value: {
              key: 'UN',
              label: 'UNIDAD'
            }
          },
          {
            name: 'brand',
            value: 'INCHALAM'
          },
          {
            name: 'netContent',
            value: '1KG'
          },
          {
            name: 'netWeight',
            value: 1.03
          },
          {
            name: 'grossWeight',
            value: 1.03
          },
          {
            name: 'weightUnit',
            value: 'kg'
          },
          {
            name: 'volume',
            value: 0.001
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
            value: '25X1X1KG'
          },
          {
            name: 'operationalUnitQuantity',
            value: 1
          },
          {
            name: 'operationalUnitPerBox',
            value: 25
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
            value: '7809801105517'
          },
          {
            name: 'DUN',
            value: 'N/A'
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
            value: '100001726'
          },
          {
            name: 'sapId',
            value: '146889'
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
              centAmount: 1528,
              fractionDigits: 0
            }
          }
        ],
        assets: [],
        availability: {
          channels: {
            '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
              isOnStock: true,
              availableQuantity: 20,
              version: 15,
              id: '1b8f19bd-d2a5-465f-acbb-89f14d0e9f57'
            }
          }
        }
      },
      price: {
        id: 'e35b9d05-7726-460c-a252-304d45131ac4',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 1644,
          fractionDigits: 0
        }
      },
      quantity: 10,
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
      addedAt: '2023-09-11T15:38:47.715Z',
      lastModifiedAt: '2023-09-11T15:38:47.715Z',
      state: [
        {
          quantity: 10,
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
        centAmount: 16440,
        fractionDigits: 0
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 16440,
          fractionDigits: 0
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 19560,
          fractionDigits: 0
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 3120,
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
          t2UnitAmount: 116,
          sapPositions:
            '{"quantity":10,"position":30,"priceConditions":[{"sapCode":"ZT02","amount":116,"currency":"CLP"},{"sapCode":"ZPRE","amount":1528,"currency":"CLP"},{"sapCode":"ZMWS","amount":312,"currency":"CLP"}]}'
        }
      }
    },
    {
      id: '6c931c3d-8bea-483d-998a-65696a50238b',
      productId: 'ad0b5d7f-4a1a-4302-8c4b-0b4fffe3bc45',
      productKey: 'prod-adelco-146676',
      name: {
        'es-CL': 'GRAPA GALVANIZADO 1 1/4 X10'
      },
      productType: {
        typeId: 'product-type',
        id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
      },
      productSlug: {
        'es-CL': 'grapa-galvanizado-1-1-4-x10-146676'
      },
      variant: {
        id: 1,
        sku: '146676',
        key: 'var-adelco-146676',
        prices: [],
        images: [
          {
            url: 'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img--iJ_guya.png',
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
                key: '1300',
                label: 'Iquique'
              },
              {
                key: '1400',
                label: 'Antofagasta'
              },
              {
                key: '1500',
                label: 'Coquimbo'
              },
              {
                key: '1800',
                label: 'Lo Boza'
              },
              {
                key: '2300',
                label: 'Temuco'
              },
              {
                key: '2400',
                label: 'Osorno'
              },
              {
                key: '2500',
                label: 'Puerto Montt'
              },
              {
                key: '2700',
                label: 'Punta Arenas'
              },
              {
                key: '2900',
                label: 'Coyhaique (Ogana)'
              },
              {
                key: '5000',
                label: 'Sur Medio'
              }
            ]
          },
          {
            name: 'sellUnit',
            value: {
              key: 'UN',
              label: 'UNIDAD'
            }
          },
          {
            name: 'brand',
            value: 'INCHALAM'
          },
          {
            name: 'netContent',
            value: '1KG'
          },
          {
            name: 'netWeight',
            value: 1.011
          },
          {
            name: 'grossWeight',
            value: 1.011
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
            value: '25X1X1KG'
          },
          {
            name: 'operationalUnitQuantity',
            value: 1
          },
          {
            name: 'operationalUnitPerBox',
            value: 25
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
            value: '7809801301919'
          },
          {
            name: 'DUN',
            value: 'N/A'
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
            value: '100001726'
          },
          {
            name: 'sapId',
            value: '146676'
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
              centAmount: 3127,
              fractionDigits: 0
            }
          }
        ],
        assets: [],
        availability: {
          channels: {
            '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
              isOnStock: true,
              availableQuantity: 34,
              version: 9,
              id: 'cf878d20-548a-49f4-91e3-78d5cc60a752'
            }
          }
        }
      },
      price: {
        id: '07bfb435-7ef9-4806-a55c-d4bad8a664fd',
        value: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 3365,
          fractionDigits: 0
        }
      },
      quantity: 10,
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
      addedAt: '2023-09-11T15:39:15.304Z',
      lastModifiedAt: '2023-09-11T15:39:15.304Z',
      state: [
        {
          quantity: 10,
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
        centAmount: 33650,
        fractionDigits: 0
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 33650,
          fractionDigits: 0
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 40040,
          fractionDigits: 0
        },
        totalTax: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 6390,
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
          t2UnitAmount: 238,
          sapPositions:
            '{"quantity":10,"position":40,"priceConditions":[{"sapCode":"ZT02","amount":238,"currency":"CLP"},{"sapCode":"ZPRE","amount":3127,"currency":"CLP"},{"sapCode":"ZMWS","amount":639,"currency":"CLP"}]}'
        }
      }
    }
  ],
  cartState: 'Ordered',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'CLP',
    centAmount: 97759,
    fractionDigits: 0
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 97759,
      fractionDigits: 0
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 116327,
      fractionDigits: 0
    },
    taxPortions: [
      {
        rate: 0,
        amount: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 0,
          fractionDigits: 0
        },
        name: 'noTax'
      },
      {
        rate: 0.19,
        amount: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 18568,
          fractionDigits: 0
        },
        name: 'IVA'
      }
    ],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 18568,
      fractionDigits: 0
    }
  },
  taxedShippingPrice: {
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
    taxPortions: [
      {
        rate: 0,
        amount: {
          type: 'centPrecision',
          currencyCode: 'CLP',
          centAmount: 0,
          fractionDigits: 0
        },
        name: 'noTax'
      }
    ],
    totalTax: {
      type: 'centPrecision',
      currencyCode: 'CLP',
      centAmount: 0,
      fractionDigits: 0
    }
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
    taxRate: {
      name: 'noTax',
      amount: 0,
      includedInPrice: false,
      country: 'CL',
      subRates: []
    },
    deliveries: [],
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
    id: 'Dd4B0eeD',
    streetName: 'Calle 43',
    streetNumber: '22',
    city: 'chimbarongo',
    region: 'del-libertador-b-o-higgins',
    country: 'CL',
    department: 'chimbarongo',
    email: 'fertester@test.com',
    additionalAddressInfo: '',
    key: 'shipping-address',
    custom: {
      type: {
        typeId: 'type',
        id: '325861c1-3138-4c0a-8a1d-32d8a45b96f7'
      },
      fields: {
        lat: -33.436313637640744
      }
    }
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
      createdBy: 'fertester@test.com',
      deliveryDate: '2023-09-14T15:39:55.505Z'
    }
  },
  paymentInfo: {
    payments: [
      {
        typeId: 'payment',
        id: 'c797f3d1-82f5-4fd2-899d-7e1fe9ab44c0'
      }
    ]
  },
  inventoryMode: 'ReserveOnOrder',
  taxMode: 'External',
  taxRoundingMode: 'HalfUp',
  taxCalculationMode: 'LineItemLevel',
  deleteDaysAfterLastModification: 90,
  refusedGifts: [],
  origin: 'Customer',
  itemShippingAddresses: [],
  businessUnit: {
    typeId: 'business-unit',
    key: '600002'
  },
  totalLineItemQuantity: 22
};

import { PriceForCTCart } from '@adelco/price-calc';
import { ProductProjection } from '@commercetools/platform-sdk';

export const mockProductProjection: ProductProjection = {
  id: 'e47276c6-b398-479d-92e6-0b8240ae72e6',
  version: 2387,
  productType: {
    typeId: 'product-type',
    id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
  },
  name: {
    'es-CL': 'PAPEL HIGIÉNICO ACOLCHADO'
  },
  description: {
    'es-CL': 'PAPEL HIGIÉNICO ACOLCHADO'
  },
  categories: [
    {
      typeId: 'category',
      id: '588927a6-500d-4865-9ced-63f019fda6bf'
    },
    {
      typeId: 'category',
      id: 'd50437e0-a6b8-4bab-a544-f94d0ba5c0f0'
    },
    {
      typeId: 'category',
      id: '1f511720-3da3-45f2-9370-580f7abaab7b'
    }
  ],
  categoryOrderHints: {},
  slug: {
    'es-CL': 'papel-higi-nico-acolchado-115800'
  },
  masterVariant: {
    id: 1,
    sku: 'sku1',
    key: 'var-adelco-115800',
    prices: [],
    images: [],
    price: {
      value: {
        type: 'centPrecision',
        centAmount: 10000,
        currencyCode: 'CLP',
        fractionDigits: 2
      },
      id: 'price'
    },
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
        value: 'FAVORITA'
      },
      {
        name: 'netContent',
        value: '4UN'
      },
      {
        name: 'netWeight',
        value: 3.9
      },
      {
        name: 'grossWeight',
        value: 3.9
      },
      {
        name: 'weightUnit',
        value: 'kg'
      },
      {
        name: 'volume',
        value: 0.088
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
        value: '17806540008809'
      },
      {
        name: 'DUN',
        value: '17806540008809'
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
        value: '0100001758'
      },
      {
        name: 'sapId',
        value: '115800'
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
          centAmount: 8450,
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
          version: 927,
          id: 'c76c4aaf-d9b0-4c84-b79e-fd726e7e4d5e'
        },
        '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
          isOnStock: false,
          availableQuantity: 0,
          version: 1,
          id: 'c8b65da9-a814-4f0c-bafe-b17845bdea02'
        }
      }
    }
  },
  variants: [],
  searchKeywords: {},
  hasStagedChanges: false,
  published: true,
  key: 'prod-adelco-115800',
  taxCategory: {
    typeId: 'tax-category',
    id: 'a3c01461-5d0a-40b6-b7a2-5fa253c2ae04',
    obj: {
      key: '100',
      id: 'id',
      version: 1,
      createdAt: '',
      lastModifiedAt: '',
      name: '',
      rates: [
        {
          name: 'name',
          amount: 1,
          includedInPrice: false,
          country: 'CL'
        }
      ]
    }
  },
  priceMode: 'Standalone',
  createdAt: '2023-03-31T15:55:26.644Z',
  lastModifiedAt: '2023-05-29T11:26:44.037Z'
};

export const mockPriceForCTCart: PriceForCTCart = {
  price: 8450,
  productDiscount: {
    description: 'description',
    discountRate: 0,
    discountedAmount: 0,
    includedInPrice: true,
    key: 'discount'
  },
  taxRate: {
    name: 'name',
    amount: 0,
    includedInPrice: false,
    country: 'CL',
    subRates: [
      {
        name: 'name',
        amount: 0
      }
    ]
  },
  unitT2charge: 10
};

export const mockBaseProduct: ProductProjection = {
  id: 'ad0b5d7f-4a1a-4302-8c4b-0b4fffe3bc45',
  version: 21,
  productType: {
    typeId: 'product-type',
    id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
  },
  name: {
    'es-CL': 'GRAPA GALVANIZADO 1 1/4 X10'
  },
  description: {
    'es-CL': 'GRAPA GALV 1 1/4 X10 INCH 25X1X1KG'
  },
  categories: [
    {
      typeId: 'category',
      id: '54351980-0cbd-4bbe-93f6-82b32d0c54c2'
    },
    {
      typeId: 'category',
      id: '2a3b7050-4ad0-4132-89fa-e55f9b381f09'
    },
    {
      typeId: 'category',
      id: '1b8bb1ac-cd88-439b-abe3-baf20c31fa3d'
    }
  ],
  categoryOrderHints: {},
  slug: {
    'es-CL': 'grapa-galvanizado-1-1-4-x10-146676'
  },
  metaTitle: {
    'es-CL': 'GRAPA GALVANIZADO 1 1/4 X10'
  },
  metaDescription: {
    'es-CL': 'GRAPA GALV 1 1/4 X10 INCH 25X1X1KG'
  },
  masterVariant: {
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
          availableQuantity: 40,
          version: 15,
          id: 'cf878d20-548a-49f4-91e3-78d5cc60a752'
        }
      }
    }
  },
  variants: [],
  searchKeywords: {},
  hasStagedChanges: false,
  published: true,
  key: 'prod-adelco-146676',
  taxCategory: {
    typeId: 'tax-category',
    id: 'a3c01461-5d0a-40b6-b7a2-5fa253c2ae04'
  },
  priceMode: 'Standalone',
  createdAt: '2023-08-07T00:26:33.333Z',
  lastModifiedAt: '2023-09-11T19:15:42.259Z'
};

export const mockProductWithoutStock: ProductProjection = {
  ...mockBaseProduct,
  masterVariant: {
    ...mockBaseProduct.masterVariant,
    availability: {
      channels: {
        '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
          isOnStock: true,
          availableQuantity: 0,
          version: 15,
          id: 'cf878d20-548a-49f4-91e3-78d5cc60a752'
        }
      }
    }
  }
};

export const mockProductWithMoreStock: ProductProjection = {
  ...mockBaseProduct,
  masterVariant: {
    ...mockBaseProduct.masterVariant,
    availability: {
      channels: {
        '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
          isOnStock: true,
          availableQuantity: 100,
          version: 15,
          id: 'cf878d20-548a-49f4-91e3-78d5cc60a752'
        }
      }
    }
  }
};

export const mockProductWithLessStock: ProductProjection = {
  ...mockBaseProduct,
  masterVariant: {
    ...mockBaseProduct.masterVariant,
    availability: {
      channels: {
        '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1': {
          isOnStock: true,
          availableQuantity: 2,
          version: 15,
          id: 'cf878d20-548a-49f4-91e3-78d5cc60a752'
        }
      }
    }
  }
};

export const mockProductsBySkus: ProductProjection[] = [
  {
    id: 'b79589f0-e3f9-4c2e-adea-f55713c9e9ab',
    version: 25,
    productType: {
      typeId: 'product-type',
      id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
    },
    name: {
      'es-CL': 'CLAVOS CORRIENTE 3 1/2 X9 BOLSA'
    },
    description: {
      'es-CL': 'CLAVOS CORR 3 1/2 X9 BS INCH 25X1X1KG'
    },
    categories: [
      {
        typeId: 'category',
        id: '54351980-0cbd-4bbe-93f6-82b32d0c54c2'
      },
      {
        typeId: 'category',
        id: '2a3b7050-4ad0-4132-89fa-e55f9b381f09'
      },
      {
        typeId: 'category',
        id: '1b8bb1ac-cd88-439b-abe3-baf20c31fa3d'
      }
    ],
    categoryOrderHints: {},
    slug: {
      'es-CL': 'clavos-corriente-3-1-2-x9-bolsa-146889'
    },
    metaTitle: {
      'es-CL': 'CLAVOS CORRIENTE 3 1/2 X9 BOLSA'
    },
    metaDescription: {
      'es-CL': 'CLAVOS CORR 3 1/2 X9 BS INCH 25X1X1KG'
    },
    masterVariant: {
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
            isOnStock: false,
            availableQuantity: 40,
            version: 19,
            id: '1b8f19bd-d2a5-465f-acbb-89f14d0e9f57'
          }
        }
      }
    },
    variants: [],
    searchKeywords: {},
    hasStagedChanges: false,
    published: true,
    key: 'prod-adelco-146889',
    taxCategory: {
      typeId: 'tax-category',
      id: 'a3c01461-5d0a-40b6-b7a2-5fa253c2ae04'
    },
    priceMode: 'Standalone',
    createdAt: '2023-08-07T00:26:34.040Z',
    lastModifiedAt: '2023-09-11T21:30:32.674Z'
  },
  {
    id: 'b91051ea-840c-4cfe-b91b-a2c7979ca9ef',
    version: 64,
    productType: {
      typeId: 'product-type',
      id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
    },
    name: {
      'es-CL': 'SHAMPOO RESTAURACIÓN'
    },
    description: {
      'es-CL': 'SHAMPOO RESTAURACIÓN PANTENE 1X12X400ML'
    },
    categories: [
      {
        typeId: 'category',
        id: '6808e6d6-ebf5-4c35-8198-a3ce88d9348f'
      },
      {
        typeId: 'category',
        id: '4b9ea91b-ff18-4f7d-ad89-c03ef60af90f'
      },
      {
        typeId: 'category',
        id: 'ecef2b12-ac11-450d-8773-1bce56173e10'
      }
    ],
    categoryOrderHints: {},
    slug: {
      'es-CL': 'shampoo-restauraci-n-159182'
    },
    metaTitle: {
      'es-CL': 'SHAMPOO RESTAURACIÓN'
    },
    metaDescription: {
      'es-CL': 'SHAMPOO RESTAURACIÓN PANTENE 1X12X400ML'
    },
    masterVariant: {
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
            version: 49,
            id: 'be3c841f-c504-4ed7-9792-61c792419199'
          }
        }
      }
    },
    variants: [],
    searchKeywords: {},
    hasStagedChanges: false,
    published: true,
    key: 'prod-adelco-159182',
    taxCategory: {
      typeId: 'tax-category',
      id: 'a3c01461-5d0a-40b6-b7a2-5fa253c2ae04'
    },
    priceMode: 'Standalone',
    createdAt: '2023-08-07T00:22:37.289Z',
    lastModifiedAt: '2023-09-11T15:39:55.995Z'
  },
  {
    id: 'aa16f59f-c258-4f5c-8825-ab36da37145d',
    version: 23,
    productType: {
      typeId: 'product-type',
      id: '0d99f336-55cc-4b01-b6b4-c40d2970f579'
    },
    name: {
      'es-CL': 'ACONDICIONADOR ACEITE COCO ARGAN'
    },
    description: {
      'es-CL': 'ACOND ACEIT COCO ARGAN FAMILAND 1X12X750'
    },
    categories: [
      {
        typeId: 'category',
        id: '6808e6d6-ebf5-4c35-8198-a3ce88d9348f'
      },
      {
        typeId: 'category',
        id: '4b9ea91b-ff18-4f7d-ad89-c03ef60af90f'
      },
      {
        typeId: 'category',
        id: '20e11c64-75c1-4b2d-baf9-23f7429d44b2'
      }
    ],
    categoryOrderHints: {},
    slug: {
      'es-CL': 'acondicionador-aceite-coco-argan-161160'
    },
    metaTitle: {
      'es-CL': 'ACONDICIONADOR ACEITE COCO ARGAN'
    },
    metaDescription: {
      'es-CL': 'ACOND ACEIT COCO ARGAN FAMILAND 1X12X750'
    },
    masterVariant: {
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
            availableQuantity: 41,
            version: 11,
            id: 'd0e41aae-4fc6-4485-a045-1effe9e708ba'
          }
        }
      }
    },
    variants: [],
    searchKeywords: {},
    hasStagedChanges: false,
    published: true,
    key: 'prod-adelco-161160',
    taxCategory: {
      typeId: 'tax-category',
      id: 'a3c01461-5d0a-40b6-b7a2-5fa253c2ae04'
    },
    priceMode: 'Standalone',
    createdAt: '2023-08-07T00:22:43.867Z',
    lastModifiedAt: '2023-09-11T15:39:56.061Z'
  }
];

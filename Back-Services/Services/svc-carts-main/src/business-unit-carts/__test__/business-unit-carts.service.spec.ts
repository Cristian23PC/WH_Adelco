const createMockedDate = (mockDate: Date) => {
  const originalDate = global.Date;
  return jest.spyOn(global, 'Date').mockImplementation((...args) => {
    if (args.length > 0) return new (Function.prototype.bind.apply(originalDate, [null, ...args]))();
    return mockDate;
  });
};

const mockBusinessUnitsService = {
  getBusinessUnitsForCustomer: jest.fn().mockImplementation(userId => {
    switch (userId) {
      case 'companyCreditBlocked':
        return Promise.resolve({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company',
              key: 'bu-key-company',
              unitType: 'Company',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: true,
              isCreditEnabled: true
            },
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company-credit-blocked',
              key: 'bu-key-division',
              unitType: 'Division',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true,
              topLevelUnit: {
                key: 'bu-key-company'
              }
            }
          ]
        });
      case 'divisionCreditBlocked':
        return Promise.resolve({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company',
              key: 'bu-key-company',
              unitType: 'Company',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true
            },
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-credit-blocked',
              key: 'bu-key-division',
              unitType: 'Division',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: true,
              isCreditEnabled: true,
              topLevelUnit: {
                key: 'bu-key-company'
              }
            }
          ]
        });
      case 'companyToleranceExceeded':
        return Promise.resolve({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company',
              key: 'bu-key-company',
              unitType: 'Company',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true
            },
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company-tolerance-exceeded',
              key: 'bu-key-division',
              unitType: 'Division',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true,
              topLevelUnit: {
                key: 'bu-key-company'
              }
            }
          ]
        });
      case 'companyLimitExceeded':
        return Promise.resolve({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company',
              key: 'bu-key-company',
              unitType: 'Company',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true
            },
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company-limit-exceeded',
              key: 'bu-key-division',
              unitType: 'Division',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true,
              topLevelUnit: {
                key: 'bu-key-company'
              }
            }
          ]
        });
      case 'companyNoCredit':
        return Promise.resolve({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company',
              key: 'bu-key-company',
              unitType: 'Company',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id'
            },
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company-no-credit',
              key: 'bu-key-division',
              unitType: 'Division',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true,
              topLevelUnit: {
                key: 'bu-key-company'
              }
            }
          ]
        });
      case 'companyCreditDisabled':
        return Promise.resolve({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company',
              key: 'bu-key-company',
              unitType: 'Company',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: false
            },
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company-credit-disabled',
              key: 'bu-key-division',
              unitType: 'Division',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true,
              topLevelUnit: {
                key: 'bu-key-company'
              }
            }
          ]
        });
      case 'companyCreditOk':
        return Promise.resolve({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-company',
              key: 'bu-key-company',
              unitType: 'Company',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true
            },
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id-credit-ok',
              key: 'bu-key-division',
              unitType: 'Division',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true,
              topLevelUnit: {
                key: 'bu-key-company'
              }
            }
          ]
        });
      default:
        return Promise.resolve({
          businessUnits: [
            {
              ...mockCompanyBusinessUnit,
              id: 'bu-id',
              deliveryZoneKey: 'dz-key',
              distributionChannelId: 'dc-id',
              creditLimit: 10000,
              creditTermDays: 30,
              creditExcessTolerance: 5000,
              isCreditBlocked: false,
              isCreditEnabled: true
            }
          ]
        });
    }
  }),
  getBusinessUnitById: jest.fn().mockImplementation((buId: string) => {
    if (buId === 'no-discount-code') {
      return Promise.resolve({ key: 'no-discount-code' });
    }
    if (buId === 'bu-id') {
      return Promise.resolve({
        key: 'key',
        deliveryZoneKey: 'devlieryZoneKey',
        distributionChannelId: 'distributionChannelId',
        taxProfile: '2',
        shouldApplyT2Rate: true,
        associates: mockCompanyBusinessUnit.associates,
        distributionCenter: '1800',
        t2Rate: '0.07'
      });
    }
    if (buId === 'error') {
      return Promise.reject(new NotFoundException('Business Unit not found'));
    }
    if (buId === 'converted') {
      return Promise.resolve(mockConvertedBusinessUnit);
    }
    return Promise.resolve({
      ...mockCompanyBusinessUnit,
      id: 'bu-id',
      deliveryZoneKey: 'dz-key',
      distributionChannelId: 'dc-id',
      shouldApplyT2Rate: true,
      distributionCenter: '1800',
      t2Rate: '0.07',
      externalId: 'externalId',
      rut: 'rut'
    });
  }),
  findBusinessUnitByIdAndCustomer: jest.fn().mockImplementation(() => Promise.resolve({ ...mockCompanyBusinessUnit, externalId: 'externalId', rut: 'rut' })),
  getAndValidateBusinessUnit: jest.fn().mockImplementation((userId: string) => {
    if (userId === 'new-cart@mail.com') {
      return Promise.resolve({ deliveryZoneKey: 'devlieryZoneKey', distributionChannelId: 'distributionChannelId', taxProfile: '2', key: 'new-cart', shouldApplyT2Rate: true });
    }

    return Promise.resolve({ deliveryZoneKey: 'devlieryZoneKey', distributionChannelId: 'distributionChannelId', taxProfile: '2', key: 'key', shouldApplyT2Rate: true });
  })
};

const mockProductsService = {
  getProductBySku: jest.fn((sku: string) => {
    if (sku === 'error-sku') {
      return Promise.reject(new Error('Commercetools error'));
    }
    if (sku === 'no-match-sku') {
      throw new NotFoundException('Product not found');
    }
    if (sku === 'no-supply') {
      return Promise.resolve({
        id: 'prod-id',
        key: 'prod-key',
        variants: [{ sku: 'sku1' }, { sku: 'no-supply' }],
        price: {
          centAmount: 10,
          currency: 'CLP',
          fractionDigits: 0
        }
      });
    }
    if (sku === 'no-availability') {
      return Promise.resolve({
        id: 'prod-id',
        key: 'prod-key',
        masterVariant: { sku: 'no-availability', availability: { channels: { dc: { isOnStock: false, availableQuantity: 0 } } } },
        price: {
          centAmount: 10,
          currency: 'CLP',
          fractionDigits: 0
        }
      });
    }
    if (sku === 'no-stock') {
      return Promise.resolve({
        id: 'prod-id',
        key: 'prod-key',
        masterVariant: { sku: 'no-stock', availability: { channels: { channelId: { isOnStock: false, availableQuantity: 0 } } } },
        price: {
          centAmount: 10,
          currency: 'CLP',
          fractionDigits: 0
        }
      });
    }
    if (sku === 'low-stock') {
      return Promise.resolve({
        id: 'prod-id',
        key: 'prod-key',
        masterVariant: { sku: 'low-stock', availability: { channels: { channelId: { isOnStock: true, availableQuantity: 1 } } } },
        price: {
          centAmount: 10,
          currency: 'CLP',
          fractionDigits: 0
        }
      });
    }
    if (sku === 'no-price') {
      return Promise.resolve({
        id: 'prod-id',
        key: 'prod-key',
        masterVariant: { sku: 'no-price', availability: { channels: { channelId: { isOnStock: true, availableQuantity: 100 } } } }
      });
    }
    if (sku === 'sku2') {
      return Promise.resolve({
        id: 'prod-id2',
        key: 'prod-key2',
        masterVariant: {
          sku: 'sku2',
          availability: { channels: { channelId: { isOnStock: true, availableQuantity: 100 } } },
          price: {
            value: {
              centAmount: 10,
              currency: 'CLP',
              fractionDigits: 0
            }
          }
        },
        taxCategory: {
          obj: {
            rates: [{}]
          }
        }
      });
    }
    return Promise.resolve({
      id: 'prod-id',
      key: 'prod-key',
      masterVariant: {
        sku: 'sku1',
        availability: { channels: { channelId: { isOnStock: true, availableQuantity: 100 } } },
        price: {
          value: {
            centAmount: 10,
            currency: 'CLP',
            fractionDigits: 0
          }
        }
      },
      taxCategory: {
        obj: {
          rates: [{}]
        }
      }
    });
  })
};

const mockDeliveryZonesService = {
  getT2Zone: jest.fn(key => {
    switch (key) {
      case 'incomplete': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { cutoffTime, ...rest } = mockDeliveryZoneValue;
        return Promise.resolve({
          ...mockDeliveryZonesResponse,
          value: {
            ...rest
          }
        });
      }
      case 'delivery-zone':
        return Promise.resolve(mockDeliveryZonesResponse);
      default:
        return Promise.resolve({
          id: 'id',
          container: 'container',
          key: 'key',
          value: {
            label: 'Label',
            t2Rate: '0.1',
            dcCode: 'dc'
          }
        });
    }
  }),
  getAndValidateDeliveryZone: jest.fn(() => Promise.resolve({ dcCode: 'dcCode', t2Rate: '0.1' }))
};

const mockCartsService = {
  getActiveCart: jest.fn().mockImplementation((id: string) => {
    switch (id) {
      case 'failure':
      case 'new-cart@mail.com':
        throw new NotFoundException('No Active Cart');
      case 'existing-cart@mail.com':
        return Promise.resolve({
          ...mockCommercetoolsCartResponse,
          lineItems: [
            {
              id: 'id',
              variant: {
                sku: 'sku1'
              },
              quantity: 1
            }
          ]
        });
      case 'companyCreditBlocked':
        return Promise.resolve({
          ...mockCommercetoolsCartResponse,
          taxedPrice: {
            totalGross: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 5000,
              fractionDigits: 0
            }
          }
        });
      case 'divisionCreditBlocked':
        return Promise.resolve({
          ...mockCommercetoolsCartResponse,
          taxedPrice: {
            totalGross: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 5000,
              fractionDigits: 0
            }
          }
        });
      case 'companyToleranceExceeded':
        return Promise.resolve({
          ...mockCommercetoolsCartResponse,
          taxedPrice: {
            totalGross: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 17500,
              fractionDigits: 0
            }
          }
        });
      case 'companyLimitExceeded':
        return Promise.resolve({
          ...mockCommercetoolsCartResponse,
          taxedPrice: {
            totalGross: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 12500,
              fractionDigits: 0
            }
          }
        });
      case 'companyNoCredit':
      case 'companyCreditDisabled':
        return Promise.resolve({
          ...mockCommercetoolsCartResponse,
          taxedPrice: {
            totalGross: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 5000,
              fractionDigits: 0
            }
          }
        });
      case 'companyCreditOk':
        return Promise.resolve({
          ...mockCommercetoolsCartResponse,
          taxedPrice: {
            totalGross: {
              type: 'centPrecision',
              currencyCode: 'CLP',
              centAmount: 5000,
              fractionDigits: 0
            }
          }
        });
      default:
        return Promise.resolve(mockCommercetoolsCartResponse);
    }
  }),
  removeLineItemAndSetCartCustomField: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockCommercetoolsCartResponse);
  }),
  updateLineItemQuantity: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockCommercetoolsCartResponse);
  }),
  addLineItems: jest.fn().mockImplementation((cartId: string) => {
    if (cartId === 'failure') {
      throw new CommercetoolsError({ statusCode: 400, message: 'Cart update error' });
    }
    return Promise.resolve(mockCommercetoolsCartResponse);
  }),
  create: jest.fn().mockImplementation((cartDraft: CartDraft, userId: string) => {
    if (userId === 'failure') {
      throw new CommercetoolsError({ statusCode: 400, message: 'Cart creation error' });
    }
    return Promise.resolve(mockCommercetoolsCartResponse);
  }),
  update: jest.fn().mockImplementation(cartId => {
    if (cartId === 'failure') {
      throw new CommercetoolsError({ statusCode: 400, message: 'Cart update error' });
    }
    return Promise.resolve(mockCommercetoolsCartResponse);
  }),
  deleteCart: jest.fn().mockImplementation(cartId => {
    if (cartId === 'failure') {
      throw new CommercetoolsError({ statusCode: 400, message: 'Cart delete error' });
    }
    return Promise.resolve();
  }),
  getByBusinessUnitKey: jest.fn().mockImplementation((userId: string, key: string) => {
    if (userId === 'new-cart@mail.com' && key === 'key') {
      throw new NotFoundException('No Active Cart');
    }
    return Promise.resolve(mockCommercetoolsCartResponse);
  }),
  updateCart: jest.fn().mockImplementation((id, version, action) => {
    if (action[0].action === 'removeDiscountCode') {
      return Promise.resolve({ ...mockCommercetoolsCartResponse, discountCodes: [] });
    }
    if (action[0].action === 'addDiscountCode') {
      return Promise.resolve({
        ...mockCommercetoolsCartResponse,
        discountCodes: [
          {
            discountCode: {
              obj: {
                code: 'code-to-add',
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
        ]
      });
    }
    return Promise.resolve(mockCommercetoolsCartResponse);
  }),
  getActiveCartById: jest.fn().mockImplementation((id: string) => {
    switch (id) {
      case 'error':
        throw new NotFoundException('No Active Anonymous Cart');
      case 'empty':
        return Promise.resolve({ ...mockCommercetoolsCartResponse });
      default:
        return Promise.resolve(mockCommercetoolsCartResponse);
    }
  })
};

const mockChannelsService = {
  getSupplyChannels: jest.fn().mockImplementation(() => {
    return Promise.resolve([{ id: 'channelId', key: 'LB', roles: ['InventorySupply'], name: { 'es-CL': 'Lo Bzoza' } }]);
  })
};

const mockCartsHelperService = {
  getProductsDraftAndLineItemsIdsToDelete: jest.fn().mockImplementation(({ lineItemsDraft }: IGetProductsDraftAndLineItemsIdsToDeleteRequest) => {
    const productDraft = {
      sku: 'sku1',
      custom: null,
      externalPrice: { centAmount: 11, currencyCode: 'CLP' },
      externalTaxRate: { amount: 0, subRates: [] },
      quantity: 10
    };
    if (lineItemsDraft[0].sku === 'sku2') {
      return {
        productsDraft: [
          {
            ...productDraft,
            quantity: 2,
            sku: 'sku2'
          }
        ],
        lineItemsIdsToDelete: []
      };
    }

    return {
      productsDraft: [productDraft],
      lineItemsIdsToDelete: ['id']
    };
  }),
  validateStock: jest.fn(() => Promise.resolve()),
  getProductForCart: jest.fn((sku: string) => {
    const response = {
      sku,
      custom: null,
      externalPrice: {
        centAmount: 11,
        currencyCode: 'CLP'
      },
      externalTaxRate: {
        amount: 0,
        subRates: []
      },
      quantity: 2
    };
    if (sku === 'sku2') {
      return Promise.resolve(response);
    }
    if (sku === 'no-price') {
      throw new BadRequestException('Missing price for product');
    }

    return Promise.resolve({ ...response, quantity: 10 });
  }),
  buildSyncCartActions: jest.fn().mockImplementation(() => {
    return [
      { action: 'addDiscountCode', code: 'DISCOUNT' },
      { action: 'addLineItem', sku: 'sku' },
      { action: 'removeLineItem', lineItemId: 'lineItemId' }
    ];
  }),
  getBusinessUnitShippingAddress: jest.fn().mockReturnValue({ country: 'CL' }),
  checkIfLastVerificationIsOlderMaxConfig: jest.fn().mockReturnValue(false),
  buildLastVerificationTimeActions: jest.fn().mockReturnValue([{ action: 'setCustomField', name: 'lastVerificationTime', value: '2023-09-29T14:16:41.435Z' }]),
  getLineItemsToAdd: jest.fn().mockImplementation(() => mockLineItemsDraft)
};

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'cart.currency':
        return 'CLP';
      default:
        return key;
    }
  }
};

const mockLoggerService = {
  info: jest.fn()
};

jest.mock('@/config/logger.config', () => jest.fn());

jest.mock('@/common/utils', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

jest.mock('@/carts/carts.service', () => ({
  CartsService: jest.fn().mockImplementation(() => mockCartsService)
}));

jest.mock('@/business-unit/business-units.service', () => ({
  BusinessUnitsService: jest.fn().mockImplementation(() => mockBusinessUnitsService)
}));

jest.mock('@/products/products.service', () => ({
  ProductsService: jest.fn().mockImplementation(() => mockProductsService)
}));

jest.mock('@/delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZonesService)
}));

jest.mock('@/channels/channels.service', () => ({
  ChannelsService: jest.fn().mockImplementation(() => mockChannelsService)
}));

jest.mock('@/carts-helper/carts-helper.service', () => ({
  CartsHelperService: jest.fn().mockImplementation(() => mockCartsHelperService)
}));

const mockPaymentMethods = {
  paymentMethods: [
    {
      key: 'BankTransfer',
      description: 'Transferencia',
      termDays: 0,
      dependsOnCreditLineStatus: false
    },
    {
      key: 'Cash',
      description: 'Efectivo',
      termDays: 0,
      dependsOnCreditLineStatus: false
    },
    {
      key: 'DayCheck',
      description: 'Cheque al día',
      termDays: 30,
      dependsOnCreditLineStatus: true
    },
    {
      key: 'DateCheck',
      description: 'Cheque a fecha a 30 días',
      termDays: 30,
      dependsOnCreditLineStatus: true
    },
    {
      key: 'Credit',
      description: 'Crédito simple a 30 días',
      termDays: 30,
      dependsOnCreditLineStatus: true
    }
  ]
};

const mockPaymentsMethodsService = {
  getEnabledPaymentMethods: jest.fn().mockImplementation(() => mockPaymentMethods)
};

jest.mock('@/payments-methods/payment-methods.service', () => ({
  PaymentsMethodsService: jest.fn().mockImplementation(() => mockPaymentsMethodsService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUnitCartsService } from '../business-unit-carts.service';
import { BusinessUnitsService } from '@/business-unit/business-units.service';
import { CartsService } from '@/carts/carts.service';
import { ProductsService } from '@/products/products.service';
import { Cart, CartDraft } from '@commercetools/platform-sdk';
import { mockCompanyBusinessUnit, mockConvertedBusinessUnit } from '@/business-unit/__mocks__/business-units.mock';
import { mockAdelcoCartResponse, mockCommercetoolsCartResponse, mockCommercetoolsCartWithLineItemResponse, mockLineItemsDraft } from '@/carts/__mock__/carts.mock';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { CommercetoolsError } from '@/nest-commercetools';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { ChannelsService } from '@/channels/channels.service';
import { ConfigService } from '@nestjs/config';
import { CartsHelperService } from '@/carts-helper/carts-helper.service';
import { IGetProductsDraftAndLineItemsIdsToDeleteRequest } from '@/carts-helper/carts-helper.interface';
import { register, unregister } from 'timezone-mock';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { ValidatorService } from '@/common/validator/validator.service';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';
import { mockDeliveryZonesResponse, mockDeliveryZoneValue } from '@/delivery-zones/__mocks__/delivery-zones.mock';
import { SALES_SOURCE_CUSTOM_FIELD } from '@/common/constants/carts';
import { AdelcoCart } from '@adelco/price-calc';

describe('BusinessUnitCartsService', () => {
  let service: BusinessUnitCartsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        BusinessUnitCartsService,
        BusinessUnitsService,
        ProductsService,
        DeliveryZonesService,
        CartsHelperService,
        ChannelsService,
        ConfigService,
        ValidatorService,
        PaymentsMethodsService
      ]
    }).compile();

    service = module.get<BusinessUnitCartsService>(BusinessUnitCartsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeliveryDates', () => {
    describe('should return delivery dates correctly', () => {
      beforeAll(() => {
        register('UTC');
      });

      afterAll(() => {
        unregister();
      });

      it('should return delivery dates', async () => {
        const mockDate = new Date('2023-08-14T12:00:00Z');
        createMockedDate(mockDate);

        const responseExpected = [
          {
            startDateTime: '2023-08-18T12:00:00.000Z',
            endDateTime: '2023-08-18T12:00:00.000Z'
          }
        ];

        const response = await service.getDeliveryDates('converted', { options: 1 });

        expect(response.deliveryDates.length).toEqual(1);
        expect(response.deliveryDates).toStrictEqual(responseExpected);
      });

      it('should return empty delivery dates', async () => {
        mockDeliveryZonesResponse.value.isAvailable = false;
        const response = await service.getDeliveryDates('converted', { options: 1 });
        expect(response.deliveryDates.length).toEqual(0);
      });
    });

    describe('should throw an error', () => {
      it('should throw businessUnitDoesNotExist', async () => {
        await expect(service.getDeliveryDates('error', { options: 1 })).rejects.toThrow(ErrorBuilder.buildError('buNotFound'));
      });

      it('should throw validator error', async () => {
        mockConvertedBusinessUnit.deliveryZoneKey = 'incomplete';
        await expect(service.getDeliveryDates('converted', { options: 1 })).rejects.toThrow(new BadRequestException('Data structure validation does not pass'));
      });
    });
  });

  describe('getActiveCart', () => {
    let response: Cart | NotFoundException | HttpException;

    describe('when get active cart without role of CSR', () => {
      beforeEach(async () => {
        response = await service.getActiveCart('bu-id', 'username@username.com', ['Admin']);
      });

      it('should return an Active Cart', () => {
        expect(response).toEqual(mockCommercetoolsCartResponse);
      });
    });

    describe('when get active cart with role of __INTERNAL__', () => {
      beforeEach(async () => {
        response = await service.getActiveCart('bu-key', 'sales_rep', ['__INTERNAL__']);
      });

      it('should call CartsService.getByBusinessUnitKey', () => {
        expect(mockCartsService.getByBusinessUnitKey).toHaveBeenCalledWith('sales_rep', 'bu-key');
      });

      it('should return an Active Cart', () => {
        expect(response).toEqual(mockCommercetoolsCartResponse);
      });
    });

    describe('when get active cart with role of CSR', () => {
      beforeEach(async () => {
        response = await service.getActiveCart('bu-key', 'username@username.com', ['CSR']);
      });

      it('should call CartsService.getActiveCart', () => {
        expect(mockCartsService.getActiveCart).toHaveBeenCalledWith('username@username.com', 'bu-key', undefined);
      });

      it('should return an Active Cart', () => {
        expect(response).toEqual(mockCommercetoolsCartResponse);
      });
    });
  });

  describe('getActiveCartByBuId', () => {
    let response: Cart | NotFoundException | HttpException;
    beforeEach(async () => {
      response = await service.getActiveCartByBuId('bu-id', 'username@username.com', ['Admin']);
    });

    describe('when get active cart', () => {
      it('should get the key for the BU', () => {
        expect(mockBusinessUnitsService.getBusinessUnitById).toHaveBeenCalledWith('bu-id');
      });

      it('should get the cart by the BU key', () => {
        expect(mockCartsService.getActiveCart).toHaveBeenCalledWith('username@username.com', 'key', [
          'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount',
          'discountCodes[*].discountCode'
        ]);
      });

      it('should return an Active Cart', () => {
        expect(response).toEqual(mockCommercetoolsCartResponse);
      });
    });
  });

  describe('deleteLineItem', () => {
    let spy: jest.SpyInstance;
    let response: Cart | NotFoundException;
    beforeAll(() => {
      spy = jest.spyOn(service, 'getActiveCart').mockImplementation((id: string) => {
        if (id === 'no-lineItem-bu-id') {
          return Promise.resolve(mockCommercetoolsCartResponse);
        }
        return Promise.resolve(mockCommercetoolsCartWithLineItemResponse);
      });
    });

    describe('when delete line item successfully', () => {
      beforeEach(async () => {
        response = await service.deleteLineItem('bu-id', 'lineItem-id', 'username@username.com', ['Admin']);
      });

      it('should call service.getActiveCart', () => {
        expect(spy).toHaveBeenCalledWith('key', 'username@username.com', ['Admin']);
      });

      it('should call mockCartsService.removeLineItemAndSetCartCustomField', () => {
        expect(mockCartsService.removeLineItemAndSetCartCustomField).toHaveBeenCalledWith('c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', 'lineItem-id', 1, undefined, undefined);
      });

      it('should return a Cart without line item', () => {
        expect(response).toEqual(mockCommercetoolsCartResponse);
      });
    });

    describe('when not find a line item', () => {
      beforeEach(async () => {
        try {
          await service.deleteLineItem('no-lineItem-bu-id', 'noLineItem-id', 'username@username.com', ['Admin']);
        } catch (error) {
          response = error;
        }
      });

      it('should call service.getActiveCart', () => {
        expect(spy).toHaveBeenCalledWith('key', 'username@username.com', ['Admin']);
      });

      it('should not call mockCartsService.removeLineItemAndSetCartCustomField', () => {
        expect(mockCartsService.removeLineItemAndSetCartCustomField).not.toHaveBeenCalled();
      });

      it('should throw a NotFound Error', () => {
        expect(response).toEqual(new NotFoundException('Line item not found'));
      });
    });
  });

  describe('updateLineItemQuantity', () => {
    let spy: jest.SpyInstance;
    let response: Cart | NotFoundException;

    beforeAll(() => {
      spy = jest.spyOn(service, 'getActiveCart').mockImplementation((id: string) => {
        if (id === 'no-lineItem-bu-id') {
          return Promise.resolve(mockCommercetoolsCartResponse);
        }
        return Promise.resolve(mockCommercetoolsCartWithLineItemResponse);
      });
    });

    describe('when update line item quantity successfully', () => {
      beforeEach(async () => {
        response = await service.updateLineItemQuantity('bu-id', 'lineItem-id', { quantity: 5 }, 'username@username.com', ['Admin']);
      });

      it('should call service.getActiveCart', () => {
        expect(spy).toHaveBeenCalledWith('key', 'username@username.com', ['Admin']);
      });

      it('should call mockCartsService.updateLineItemQuantity', () => {
        expect(mockCartsService.updateLineItemQuantity).toHaveBeenCalledWith(5, 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', mockCommercetoolsCartWithLineItemResponse.lineItems[0], 1, {
          expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode']
        });
      });

      it('should return a Cart without line item', () => {
        expect(response).toEqual(mockCommercetoolsCartResponse);
      });
    });

    describe('when not find a line item', () => {
      beforeEach(async () => {
        try {
          await service.updateLineItemQuantity('no-lineItem-bu-id', 'noLineItem-id', { quantity: 5 }, 'username@username.com', ['Admin']);
        } catch (error) {
          response = error;
        }
      });

      it('should call service.getActiveCart', () => {
        expect(spy).toHaveBeenCalledWith('key', 'username@username.com', ['Admin']);
      });

      it('should not call mockCartsService.updateLineItemQuantity', () => {
        expect(mockCartsService.updateLineItemQuantity).not.toHaveBeenCalled();
      });

      it('should throw a NotFound Error', () => {
        expect(response).toEqual(new NotFoundException('Line item not found'));
      });
    });
  });

  describe('addLineItems', () => {
    beforeAll(() => {
      jest.restoreAllMocks();
    });

    describe('when active cart exists, update adding line items', () => {
      describe('when the line item already exists in the cart, update the total quantity', () => {
        describe('when adding the line item succeeds', () => {
          beforeEach(async () => {
            await service.addLineItems('existing-cart@mail.com', { sku: 'sku1', quantity: 9 }, 'existing-cart-li', ['Admin']);
          });

          it('should update cart, existing line item added with new quantity and old line item removed', () => {
            expect(mockCartsService.addLineItems).toHaveBeenCalledWith(
              'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
              1,
              [
                {
                  externalPrice: {
                    centAmount: 11,
                    currencyCode: 'CLP'
                  },
                  externalTaxRate: {
                    amount: 0,
                    subRates: []
                  },
                  quantity: 10,
                  sku: 'sku1',
                  custom: null
                }
              ],
              ['id'],
              { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] }
            );
          });
        });
      });

      describe('when the line item does not exist in the cart, add it with the new quantity', () => {
        describe('when updating the line item succeeds', () => {
          beforeEach(async () => {
            await service.addLineItems('existing-cart@mail.com', { sku: 'sku2', quantity: 2 }, 'existing-cart-li', ['Admin']);
          });

          it('should update cart, new line items added with new quantity and no old line item removed', () => {
            expect(mockCartsService.addLineItems).toHaveBeenCalledWith(
              'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
              1,
              [
                {
                  externalPrice: {
                    centAmount: 11,
                    currencyCode: 'CLP'
                  },
                  externalTaxRate: {
                    amount: 0,
                    subRates: []
                  },
                  quantity: 2,
                  sku: 'sku2',
                  custom: null
                }
              ],
              [],
              { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] }
            );
          });
        });
      });
    });

    describe('when active cart does not exist, create a new cart with the line items', () => {
      describe('when creating the cart succeeds', () => {
        beforeEach(async () => {
          await service.addLineItems('new-cart@mail.com', { sku: 'sku1', quantity: 10 }, 'new-cart', ['Admin']);
        });

        it('should update cart', () => {
          expect(mockCartsService.create).toHaveBeenCalledWith(
            {
              shippingAddress: {
                country: 'CL',
                email: 'new-cart@mail.com'
              },
              lineItems: [
                {
                  externalPrice: {
                    centAmount: 11,
                    currencyCode: 'CLP'
                  },
                  externalTaxRate: {
                    amount: 0,
                    subRates: []
                  },
                  quantity: 10,
                  sku: 'sku1',
                  custom: null
                }
              ]
            },
            'new-cart@mail.com',
            'new-cart',
            'key',
            'rut',
            'externalId',
            { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] }
          );
        });
      });
    });
  });

  describe('deleteCart', () => {
    beforeAll(() => {
      jest.restoreAllMocks();
    });

    describe('when active cart exists, delete Cart', () => {
      describe('when deleting cart succeeds', () => {
        beforeEach(async () => {
          await service.deleteCart('existing-cart@mail.com', 'existing-cart-li', ['Admin']);
        });

        it('should delete cart', () => {
          expect(mockCartsService.deleteCart).toHaveBeenCalledWith('c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', 1);
        });
      });
    });

    describe('when active cart does not exist, throw not found error', () => {
      let response;
      beforeEach(async () => {
        try {
          await service.deleteCart('new-cart@mail.com', 'new-cart', ['Admin']);
          fail();
        } catch (error) {
          response = error;
        }
      });

      it('should never call delete cart', () => {
        expect(mockCartsService.deleteCart).not.toHaveBeenCalled();
      });

      it('should throw not found error', () => {
        expect(response.message).toEqual('No Active Cart');
      });
    });
  });

  describe('updateSyncCart', () => {
    let response: Cart | NotFoundException;

    describe('when update a cart successfully', () => {
      beforeEach(async () => {
        response = await service.updateSyncCart('user-id', 'bu-id', { lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' });
      });

      it('should call BusinessUnitService.getBusinessUnitById', () => {
        expect(mockBusinessUnitsService.getBusinessUnitById).toHaveBeenCalledWith('bu-id');
      });

      it('should call CartsService.getByBusinessUnitKey', () => {
        expect(mockCartsService.getByBusinessUnitKey).toHaveBeenCalledWith('user-id', 'key');
      });

      it('should call CartsHelperService.getProductsDraftAndLineItemsIdsToDelete', () => {
        expect(mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete).toHaveBeenCalledWith({
          cart: mockCommercetoolsCartResponse,
          distributionChannelId: 'distributionChannelId',
          isSyncCart: true,
          lineItemsDraft: [{ quantity: 1, sku: 'sku' }],
          shouldApplyT2Rate: true,
          taxProfile: '2',
          dcCode: '1800',
          t2Rate: '0.07',
          isUpdateLastVerificationTime: false
        });
      });

      it('should call CartsHelperService.buildSyncCartActions', () => {
        expect(mockCartsHelperService.buildSyncCartActions).toHaveBeenCalledWith(
          mockCommercetoolsCartResponse,
          {
            lineItemsIdsToDelete: ['id'],
            productsDraft: [{ custom: null, externalPrice: { centAmount: 11, currencyCode: 'CLP' }, externalTaxRate: { amount: 0, subRates: [] }, quantity: 10, sku: 'sku1' }]
          },
          ['DISCOUNT'],
          'Payment'
        );
      });

      it('should call CartsService.updateCart', () => {
        expect(mockCartsService.updateCart).toHaveBeenCalledWith(
          'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
          1,
          [
            { action: 'addDiscountCode', code: 'DISCOUNT' },
            { action: 'addLineItem', sku: 'sku' },
            { action: 'removeLineItem', lineItemId: 'lineItemId' }
          ],
          { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] }
        );
      });

      it('should return an AdelcoCart', () => {
        expect(response).toEqual({
          ...mockAdelcoCartResponse,
          discountCodes: [
            {
              ...mockAdelcoCartResponse.discountCodes[0],
              discountCode: {
                ...mockAdelcoCartResponse.discountCodes[0].discountCode,
                obj: { ...mockAdelcoCartResponse.discountCodes[0].discountCode.obj, code: 'code-to-add' }
              }
            }
          ]
        });
      });
    });

    describe('when update a cart successfully and dont have action to update', () => {
      beforeEach(async () => {
        mockCartsHelperService.buildSyncCartActions.mockImplementationOnce(() => []);
        response = await service.updateSyncCart('user-id', 'bu-id', { lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' });
      });

      it('should call BusinessUnitService.getBusinessUnitById', () => {
        expect(mockBusinessUnitsService.getBusinessUnitById).toHaveBeenCalledWith('bu-id');
      });

      it('should call CartsService.getByBusinessUnitKey', () => {
        expect(mockCartsService.getByBusinessUnitKey).toHaveBeenCalledWith('user-id', 'key');
      });

      it('should call CartsHelperService.getProductsDraftAndLineItemsIdsToDelete', () => {
        expect(mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete).toHaveBeenCalledWith({
          cart: mockCommercetoolsCartResponse,
          dcCode: '1800',
          t2Rate: '0.07',
          distributionChannelId: 'distributionChannelId',
          isSyncCart: true,
          lineItemsDraft: [{ quantity: 1, sku: 'sku' }],
          shouldApplyT2Rate: true,
          taxProfile: '2',
          isUpdateLastVerificationTime: false
        });
      });

      it('should call CartsHelperService.buildSyncCartActions', () => {
        expect(mockCartsHelperService.buildSyncCartActions).toHaveBeenCalledWith(
          mockCommercetoolsCartResponse,
          {
            lineItemsIdsToDelete: ['id'],
            productsDraft: [{ custom: null, externalPrice: { centAmount: 11, currencyCode: 'CLP' }, externalTaxRate: { amount: 0, subRates: [] }, quantity: 10, sku: 'sku1' }]
          },
          ['DISCOUNT'],
          'Payment'
        );
      });

      it('should not call CartsService.updateCart', () => {
        expect(mockCartsService.updateCart).not.toHaveBeenCalled();
      });

      it('should return an adelco cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when create a cart successfully', () => {
      beforeEach(async () => {
        response = await service.updateSyncCart('new-cart@mail.com', 'key', {
          lineItems: [{ sku: 'sku', quantity: 1 }],
          discountCodes: ['DISCOUNT'],
          paymentMethod: 'Payment'
        });
      });

      it('should call BusinessUnitService.getBusinessUnitById', () => {
        expect(mockBusinessUnitsService.getBusinessUnitById).toHaveBeenCalledWith('key');
      });

      it('should call CartsService.getByBusinessUnitKey', () => {
        expect(mockCartsService.getByBusinessUnitKey).toHaveBeenCalledWith('new-cart@mail.com', 'key');
      });

      it('should call CartsHelperService.getProductsDraftAndLineItemsIdsToDelete', () => {
        expect(mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete).toHaveBeenCalledWith({
          cart: undefined,
          dcCode: '1800',
          t2Rate: '0.07',
          distributionChannelId: 'dc-id',
          isSyncCart: true,
          lineItemsDraft: [{ quantity: 1, sku: 'sku' }],
          shouldApplyT2Rate: true,
          taxProfile: undefined,
          isUpdateLastVerificationTime: false
        });
      });

      it('should not call CartsHelperService.buildSyncCartActions', () => {
        expect(mockCartsHelperService.buildSyncCartActions).not.toHaveBeenCalled();
      });

      it('should call CartsService.create', () => {
        expect(mockCartsService.create).toHaveBeenCalledWith(
          {
            shippingAddress: {
              country: 'CL',
              email: 'Gssghd@hdhd.com'
            },
            discountCodes: ['DISCOUNT'],
            lineItems: [{ custom: null, externalPrice: { centAmount: 11, currencyCode: 'CLP' }, externalTaxRate: { amount: 0, subRates: [] }, quantity: 10, sku: 'sku1' }]
          },
          'new-cart@mail.com',
          'bu-id',
          'key',
          'rut',
          'externalId',
          { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] },
          SALES_SOURCE_CUSTOM_FIELD
        );
      });

      it('should not call CartsService.updateCart', () => {
        expect(mockCartsService.updateCart).not.toHaveBeenCalled();
      });

      it('should return an adelco cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when not found key for business unit', () => {
      beforeEach(async () => {
        mockBusinessUnitsService.getBusinessUnitById.mockImplementationOnce(() => {});
        try {
          await service.updateSyncCart('user-id', 'bu-id', { lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' });
        } catch (error) {
          response = error;
        }
      });

      it('should call BusinessUnitService.getBusinessUnitById', () => {
        expect(mockBusinessUnitsService.getBusinessUnitById).toHaveBeenCalledWith('bu-id');
      });

      it('should not call CartsService.getByBusinessUnitKey', () => {
        expect(mockCartsService.getByBusinessUnitKey).not.toHaveBeenCalled();
      });

      it('should not call CartsHelperService.getProductsDraftAndLineItemsIdsToDelete', () => {
        expect(mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete).not.toHaveBeenCalled();
      });

      it('should not call CartsHelperService.buildSyncCartActions', () => {
        expect(mockCartsHelperService.buildSyncCartActions).not.toHaveBeenCalled();
      });

      it('should not call CartsService.updateCart', () => {
        expect(mockCartsService.updateCart).not.toHaveBeenCalled();
      });

      it('should return a NotFoundException', () => {
        expect(response).toEqual(new NotFoundException(`Key not found for business unit bu-id`));
      });
    });

    describe('when update a cart successfully forcing cart update', () => {
      beforeEach(async () => {
        response = await service.updateSyncCart('user-id', 'bu-id', { lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' }, true);
      });

      it('should call BusinessUnitService.getBusinessUnitById', () => {
        expect(mockBusinessUnitsService.getBusinessUnitById).toHaveBeenCalledWith('bu-id');
      });

      it('should call CartsService.getByBusinessUnitKey', () => {
        expect(mockCartsService.getByBusinessUnitKey).toHaveBeenCalledWith('user-id', 'key');
      });

      it('should call CartsHelperService.getProductsDraftAndLineItemsIdsToDelete', () => {
        expect(mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete).toHaveBeenCalledWith({
          cart: mockCommercetoolsCartResponse,
          distributionChannelId: 'distributionChannelId',
          isSyncCart: true,
          lineItemsDraft: [{ quantity: 1, sku: 'sku' }],
          shouldApplyT2Rate: true,
          taxProfile: '2',
          dcCode: '1800',
          t2Rate: '0.07',
          isUpdateLastVerificationTime: true
        });
      });

      it('should call CartsHelperService.buildSyncCartActions', () => {
        expect(mockCartsHelperService.buildSyncCartActions).toHaveBeenCalledWith(
          mockCommercetoolsCartResponse,
          {
            lineItemsIdsToDelete: ['id'],
            productsDraft: [{ custom: null, externalPrice: { centAmount: 11, currencyCode: 'CLP' }, externalTaxRate: { amount: 0, subRates: [] }, quantity: 10, sku: 'sku1' }]
          },
          ['DISCOUNT'],
          'Payment'
        );
      });

      it('should call CartsService.updateCart', () => {
        expect(mockCartsService.updateCart).toHaveBeenCalledWith(
          'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
          1,
          [
            { action: 'addDiscountCode', code: 'DISCOUNT' },
            { action: 'addLineItem', sku: 'sku' },
            { action: 'removeLineItem', lineItemId: 'lineItemId' },
            { action: 'setCustomField', name: 'lastVerificationTime', value: '2023-09-29T14:16:41.435Z' }
          ],
          { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] }
        );
      });

      it('should return an AdelcoCart', () => {
        expect(response).toEqual({
          ...mockAdelcoCartResponse,
          discountCodes: [
            {
              ...mockAdelcoCartResponse.discountCodes[0],
              discountCode: {
                ...mockAdelcoCartResponse.discountCodes[0].discountCode,
                obj: { ...mockAdelcoCartResponse.discountCodes[0].discountCode.obj, code: 'code-to-add' }
              }
            }
          ]
        });
      });
    });
  });

  describe('deleteDiscountCode', () => {
    let spyGetActiveCart: jest.SpyInstance;
    let response: Cart | NotFoundException;

    beforeEach(() => {
      spyGetActiveCart = jest.spyOn(service, 'getActiveCart').mockImplementationOnce((buKey: string) => {
        if (buKey === 'no-discount-code') {
          return Promise.resolve({ ...mockCommercetoolsCartResponse, discountCodes: [] });
        }
        return Promise.resolve(mockCommercetoolsCartResponse);
      });
    });

    describe('when delete discount code successfully', () => {
      beforeEach(async () => {
        response = await service.deleteDiscountCode('bu-id', 'code-to-remove', 'username@username.com', ['Admin']);
      });

      it('should call businessUnitService.getBusinessUnitById', () => {
        expect(mockBusinessUnitsService.getBusinessUnitById).toHaveBeenCalledWith('bu-id');
      });

      it('should call service.getActiveCart', () => {
        expect(spyGetActiveCart).toHaveBeenCalledWith(
          'key',
          'username@username.com',
          ['Admin'],
          ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode']
        );
      });

      it('should call mockCartsService.updateCart', () => {
        expect(mockCartsService.updateCart).toHaveBeenCalledWith(
          'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
          1,
          [
            {
              action: 'removeDiscountCode',
              discountCode: {
                typeId: 'discount-code',
                id: 'discount-code-id'
              }
            }
          ],
          { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] }
        );
      });

      it('should return a Cart without discount code', () => {
        expect(response).toEqual({ ...mockCommercetoolsCartResponse, discountCodes: [] });
      });
    });

    describe('when not found discount code', () => {
      beforeEach(async () => {
        try {
          await service.deleteDiscountCode('no-discount-code', 'code-to-remove', 'username@username.com', ['Admin']);
        } catch (error) {
          response = error;
        }
      });

      it('should call service.getActiveCart', () => {
        expect(spyGetActiveCart).toHaveBeenCalledWith(
          'no-discount-code',
          'username@username.com',
          ['Admin'],
          ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode']
        );
      });

      it('should not call mockCartsService.updateCart', () => {
        expect(mockCartsService.updateCart).not.toHaveBeenCalled();
      });

      it('should throw a NotFound Error', () => {
        expect(response).toEqual(new NotFoundException('Discount code does not exist'));
      });
    });
  });

  describe('addDiscountCode', () => {
    let spyGetActiveCart: jest.SpyInstance;
    let response: Cart | NotFoundException;

    beforeEach(() => {
      spyGetActiveCart = jest.spyOn(service, 'getActiveCart').mockImplementationOnce(() => {
        return Promise.resolve(mockCommercetoolsCartResponse);
      });
    });

    describe('when add discount code successfully', () => {
      beforeEach(async () => {
        response = await service.addDiscountCode('bu-id', 'code-to-add', 'username@username.com', ['Admin']);
      });

      it('should call service.getActiveCart', () => {
        expect(spyGetActiveCart).toHaveBeenCalledWith(
          'key',
          'username@username.com',
          ['Admin'],
          ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode']
        );
      });

      it('should call mockCartsService.updateCart', () => {
        expect(mockCartsService.updateCart).toHaveBeenCalledWith(
          'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
          1,
          [
            {
              action: 'addDiscountCode',
              code: 'code-to-add'
            }
          ],
          { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] }
        );
      });

      it('should return a Cart with discount code', () => {
        expect(response).toEqual({
          ...mockCommercetoolsCartResponse,
          discountCodes: [
            {
              discountCode: {
                id: 'discount-code-id',
                obj: {
                  cartDiscounts: [],
                  code: 'code-to-add',
                  createdAt: '',
                  groups: [],
                  id: 'discount-code-id',
                  isActive: false,
                  lastModifiedAt: '',
                  references: [],
                  version: 0
                },
                typeId: 'discount-code'
              },
              state: ''
            }
          ]
        });
      });
    });
  });

  describe('addDeliveryDate', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let response: Cart | NotFoundException;
    let spyGetActiveCart: jest.SpyInstance;

    const date = '2023-08-31T19:05:37.676Z';

    beforeAll(() => {
      spyGetActiveCart = jest.spyOn(service, 'getActiveCart').mockImplementation(() => {
        return Promise.resolve(mockCommercetoolsCartResponse);
      });
    });

    beforeEach(async () => {
      response = await service.addDeliveryDate('bu-id', { date }, 'username@username.com', ['__INTERNAL__']);
    });

    it('should call getActiveCart', () => {
      expect(spyGetActiveCart).toHaveBeenCalledWith('key', 'username@username.com', ['__INTERNAL__']);
    });

    it('should call updateCart', () => {
      expect(mockCartsService.updateCart).toHaveBeenCalledWith(
        'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
        1,
        [
          {
            action: 'setCustomField',
            name: 'deliveryDate',
            value: date
          }
        ],
        { expand: ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'] }
      );
    });
  });

  describe('getEnabledPaymentMethods', () => {
    describe('when business unit has credit', () => {
      beforeEach(async () => {
        await service.getEnabledPaymentMethods('bu-id', 'johndoe@mail.com');
      });
      it('should call getBusinessUnitsForCustomer with the correct params', () => {
        expect(mockBusinessUnitsService.getBusinessUnitsForCustomer).toHaveBeenCalledWith('johndoe@mail.com');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(true, {
          creditExcessTolerance: 5000,
          creditLimit: 10000,
          creditTermDays: 30,
          isCreditBlocked: false,
          isCreditEnabled: true
        });
      });
    });

    describe('when business unit is division and company has credit blocked', () => {
      beforeEach(async () => {
        await service.getEnabledPaymentMethods('bu-id-company-credit-blocked', 'companyCreditBlocked');
      });
      it('should call getBusinessUnitsForCustomer with the correct params', () => {
        expect(mockBusinessUnitsService.getBusinessUnitsForCustomer).toHaveBeenCalledWith('companyCreditBlocked');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(true, {
          creditExcessTolerance: 5000,
          creditLimit: 10000,
          creditTermDays: 30,
          isCreditBlocked: true,
          isCreditEnabled: true
        });
      });
    });

    describe('when division does not have credit blocked but the company does', () => {
      beforeEach(async () => {
        await service.getEnabledPaymentMethods('bu-id-credit-blocked', 'divisionCreditBlocked');
      });
      it('should call getBusinessUnitsForCustomer with the correct params', () => {
        expect(mockBusinessUnitsService.getBusinessUnitsForCustomer).toHaveBeenCalledWith('divisionCreditBlocked');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(true, {
          creditExcessTolerance: 5000,
          creditLimit: 10000,
          creditTermDays: 30,
          isCreditBlocked: true,
          isCreditEnabled: true
        });
      });
    });

    describe('when division has credit but company credit and tolerance is exceeded', () => {
      beforeEach(async () => {
        await service.getEnabledPaymentMethods('bu-id-company-tolerance-exceeded', 'companyToleranceExceeded');
      });
      it('should call getBusinessUnitsForCustomer with the correct params', () => {
        expect(mockBusinessUnitsService.getBusinessUnitsForCustomer).toHaveBeenCalledWith('companyToleranceExceeded');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(true, {
          creditExcessTolerance: 5000,
          creditLimit: 10000,
          creditTermDays: 30,
          isCreditBlocked: false,
          isCreditEnabled: true
        });
      });
    });

    describe('when division has credit but company credit is exceeded, but within tolerance', () => {
      beforeEach(async () => {
        await service.getEnabledPaymentMethods('bu-id-company-limit-exceeded', 'companyLimitExceeded');
      });
      it('should call getBusinessUnitsForCustomer with the correct params', () => {
        expect(mockBusinessUnitsService.getBusinessUnitsForCustomer).toHaveBeenCalledWith('companyLimitExceeded');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(true, {
          creditExcessTolerance: 5000,
          creditLimit: 10000,
          creditTermDays: 30,
          isCreditBlocked: false,
          isCreditEnabled: true
        });
      });
    });

    describe('when division has credit but company credit and tolerance are not set (use defaults)', () => {
      beforeEach(async () => {
        await service.getEnabledPaymentMethods('bu-id-company-no-credit', 'companyNoCredit');
      });
      it('should call getBusinessUnitsForCustomer with the correct params', () => {
        expect(mockBusinessUnitsService.getBusinessUnitsForCustomer).toHaveBeenCalledWith('companyNoCredit');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(false, {
          creditExcessTolerance: 0,
          creditLimit: 0,
          creditTermDays: 30,
          isCreditBlocked: false,
          isCreditEnabled: false
        });
      });
    });

    describe('when division has credit and cart value is within company credit and tolerance', () => {
      beforeEach(async () => {
        await service.getEnabledPaymentMethods('bu-id-credit-ok', 'companyCreditOk');
      });
      it('should call getBusinessUnitsForCustomer with the correct params', () => {
        expect(mockBusinessUnitsService.getBusinessUnitsForCustomer).toHaveBeenCalledWith('companyCreditOk');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(true, {
          creditExcessTolerance: 5000,
          creditLimit: 10000,
          creditTermDays: 30,
          isCreditBlocked: false,
          isCreditEnabled: true
        });
      });
    });

    describe('when division has credit but company credit is disabled', () => {
      beforeEach(async () => {
        await service.getEnabledPaymentMethods('bu-id-company-credit-disabled', 'companyCreditDisabled');
      });
      it('should call getBusinessUnitsForCustomer with the correct params', () => {
        expect(mockBusinessUnitsService.getBusinessUnitsForCustomer).toHaveBeenCalledWith('companyCreditDisabled');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(false, {
          creditExcessTolerance: 5000,
          creditLimit: 10000,
          creditTermDays: 30,
          isCreditBlocked: false,
          isCreditEnabled: false
        });
      });
    });
  });

  describe('mergeCarts', () => {
    const userId = 'userId';
    const buId = 'buId';

    describe('when business unit does not exist', () => {
      it('should throw a not found exception', async () => {
        await expect(service.mergeCarts(userId, 'error', '123')).rejects.toThrow('Business Unit not found');
      });
    });

    describe('when anonymous cart does not exist', () => {
      it('should throw a bad request exception', async () => {
        await expect(service.mergeCarts(userId, buId, 'error')).rejects.toThrow('No Active Anonymous Cart');
      });
    });

    describe('when work correctly', () => {
      let response: AdelcoCart;
      const anonymousCartId = '123';

      beforeEach(async () => {
        response = await service.mergeCarts(userId, buId, anonymousCartId);
      });

      it('should call CartHelper.getLineItemsToAdd', () => {
        expect(mockCartsHelperService.getLineItemsToAdd).toHaveBeenCalled();
      });
      it('should call cartsHelperService.getProductsDraftAndLineItemsIdsToDelete', () => {
        expect(mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete).toHaveBeenCalled();
      });
      it('should return an adelco cart', () => {
        expect(response).toEqual({
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
                  code: 'code-to-add',
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
          },
          totalDetails: {
            subtotalPrice: 0,
            discounts: [],
            netPrice: 0,
            taxes: [],
            grossPrice: 0
          }
        });
      });
    });
  });
});

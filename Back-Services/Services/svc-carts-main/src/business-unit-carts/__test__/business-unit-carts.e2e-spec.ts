global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

const createMockedDate = (mockDate: Date) => {
  const currentDate = mockDate;

  class MockedDate extends Date {
    constructor(...args: any[]) {
      super(args.length === 0 ? currentDate.getTime() : args[0]);
    }
    static now() {
      return currentDate.getTime();
    }
  }

  (global as any).Date = MockedDate;

  return {
    restore: () => {
      (global as any).Date = Date;
    }
  };
};

const mockBusinessUnitsService = {
  getBusinessUnitsForCustomer: jest.fn().mockImplementation(() => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })),
  getBusinessUnitById: jest.fn().mockImplementation((id: string) => {
    if (id === 'not-found-bu' || id === 'error') {
      return Promise.reject(new NotFoundException('Business Unit not found'));
    }
    if (id === 'converted') {
      return Promise.resolve(mockConvertedBusinessUnit);
    }
    if (id === 'delivery-zone') {
      return Promise.resolve(mockCompanyBusinessUnitWithFullDeliveryZone);
    }
    if (id === 'without-delivery-zone') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { custom, ...buCompanyRest } = mockCompanyBusinessUnitWithFullDeliveryZone;
      return Promise.resolve(buCompanyRest);
    }
    return Promise.resolve({ ...mockCompanyBusinessUnit, id, deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' });
  }),
  findBusinessUnitByIdAndCustomer: jest.fn().mockImplementation((id: string, customerEmail: string) => {
    if (customerEmail === 'nobu@nobu.com') {
      throw new NotFoundException('Business unit not found');
    }
    if (customerEmail === 'nokeybu@nokeybu.com') {
      throw new BadRequestException('Business unit has no key');
    }
    if (customerEmail === 'notfound@notfound.com') {
      throw new NotFoundException('Customer not found');
    }
    if (customerEmail === 'nokeybu@nokeybu.com') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { key, ...rest } = mockCompanyBusinessUnit;
      return Promise.resolve({ businessUnits: [{ ...rest, id: 'no-key-bu' }] });
    }
    if (customerEmail === 'norate@mail.com') {
      return Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-rate', deliveryZoneKey: 'no-rate', distributionChannelId: 'dc-id' }] });
    }
    if (customerEmail === 'nozone@mail.com') {
      return Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-zone', distributionChannelId: 'dc-id' }] });
    }
    if (customerEmail === 'nodc@mail.com') {
      return Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-dc', deliveryZoneKey: 'dz-key' }] });
    }
    if (customerEmail === 'no-price@mail.com') {
      return Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-price', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' }] });
    }
    if (customerEmail === 'with-credit@mail.com') {
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

    return Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' }] });
  })
};

jest.mock('@/business-unit/business-units.service', () => ({
  BusinessUnitsService: jest.fn(() => Promise.resolve(mockBusinessUnitsService))
}));

const mockProductsService = {
  getProductBySku: jest.fn((sku: string) => {
    if (sku === 'error-sku') {
      return Promise.reject(new Error('Commercetools error'));
    }
    if (sku === 'no-match-sku') {
      throw new NotFoundException('Product not found');
    }
    if (sku === 'no-price') {
      return Promise.resolve({
        id: 'prod-id',
        key: 'prod-key',
        masterVariant: {
          sku: 'no-price',
          availability: { channels: { channelId: { isOnStock: true, availableQuantity: 100 } } }
        },
        taxCategory: {
          obj: {
            rates: [{}]
          }
        }
      });
    }
    if (sku === 'no-availability') {
      return Promise.resolve({
        id: 'prod-id',
        key: 'prod-key',
        masterVariant: {
          sku: 'no-availability',
          availability: {},
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

jest.mock('@/products/products.service', () => ({
  ProductsService: jest.fn().mockImplementation(() => mockProductsService)
}));

const mockCartsRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('nocart@nocart.com'))) {
      return Promise.resolve({ results: [] });
    }
    if (
      queryArgs?.where.some(
        condition =>
          condition.match('usernameDeleteLineItem@username.com') ||
          condition.match('usernameUpdateQuantityLineItem@username.com') ||
          condition.match('usernameAddLineItem@username.com') ||
          condition.match('usernameDeleteDiscountCode@username.com')
      )
    ) {
      return Promise.resolve({ results: [mockCommercetoolsCartWithLineItemResponse] });
    }
    return Promise.resolve({
      results: [mockCommercetoolsCartResponse]
    });
  }),
  updateById: jest.fn(() => mockCommercetoolsCartResponse),
  deleteById: jest.fn(() => {}),
  create: jest.fn(() => mockCommercetoolsCartResponse),
  updateCart: jest.fn(v => v)
};

const mockDeliveryZonesService = {
  getT2Zone: jest.fn(key => {
    switch (key) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The CustomObject with ID '(container,error)' was not found.",
            errors: [
              {
                code: 'InvalidSubject',
                message: "The CustomObject with ID '(container,error)' was not found."
              }
            ]
          })
        );
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
      case 'no-rate':
        return Promise.resolve({
          id: 'id',
          container: 'container',
          key: 'key',
          value: {
            label: 'Label',
            dcCode: 'dc'
          }
        });
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

jest.mock('@/delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZonesService)
}));

const mockCartsHelperService = {
  validateStock: jest.fn(() => {
    return Promise.resolve();
  }),
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
    if (sku === 'no-match-sku') {
      throw new NotFoundException('Product not found');
    }

    return Promise.resolve({ ...response, quantity: 10 });
  }),
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
  buildLineItemActions: jest.fn().mockImplementation(() => [
    {
      action: 'addLineItem',
      sku: 'sku1',
      quantity: 1
    },
    {
      action: 'addLineItem',
      sku: 'sku2',
      quantity: 2
    },
    {
      action: 'removeLineItem',
      lineItemId: 'id-to-delete'
    }
  ]),
  buildSyncCartActions: jest.fn().mockImplementation(() => {
    return [
      { action: 'addDiscountCode', code: 'DISCOUNT' },
      { action: 'addLineItem', sku: 'sku' },
      { action: 'removeLineItem', lineItemId: 'lineItemId' }
    ];
  }),
  checkIfLastVerificationIsOlderMaxConfig: jest.fn().mockImplementation(() => false),
  verifyPricesAndStock: jest.fn().mockImplementation(() => {
    return Promise.resolve({ isQuantityUpdated: true, isPriceUpdated: true, updatedPricesAction: [], updatedQuantitiesAction: [] });
  }),
  buildLastVerificationTimeActions: jest.fn().mockImplementation(() => [{ action: 'setCustomField', name: 'lastVerificationTime', value: '2023-09-07T15:02:55.419Z' }]),
  buildCustomFieldActions: jest.fn().mockImplementation(() => [])
};

jest.mock('@/carts-helper/carts-helper.service', () => ({
  CartsHelperService: jest.fn().mockImplementation(() => mockCartsHelperService)
}));

const mockChannelsRepository = {
  find: jest.fn().mockImplementation(() =>
    Promise.resolve({
      results: [
        {
          id: 'channelId',
          key: 'dcCode',
          roles: ['InventorySupply']
        }
      ]
    })
  )
};

const mockCustomObjectsRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('container="custom-object-payment-method.paymentMethodContainer"'))) {
      return Promise.resolve({
        results: [
          {
            key: 'BankTransfer',
            value: {
              enabled: true,
              description: 'Transferencia',
              dependsOnCreditLineStatus: false,
              displayAsPaymentOption: false,
              sapMethod: 'T',
              sapConditions: {
                '0': 'ZD16'
              }
            }
          },
          {
            key: 'Cash',
            value: {
              enabled: true,
              description: 'Efectivo',
              dependsOnCreditLineStatus: false,
              displayAsPaymentOption: true,
              sapMethod: 'E',
              sapConditions: {
                '0': 'ZD01'
              }
            }
          },
          {
            key: 'DayCheck',
            value: {
              enabled: true,
              description: 'Cheque al día',
              dependsOnCreditLineStatus: true,
              displayAsPaymentOption: true,
              sapMethod: 'C',
              sapConditions: {
                '1': 'ZD02'
              }
            }
          },
          {
            key: 'DateCheck',
            value: {
              enabled: true,
              description: 'Cheque a fecha a %TERM% días',
              dependsOnCreditLineStatus: true,
              displayAsPaymentOption: true,
              sapMethod: 'S',
              sapConditions: {
                '5': 'ZD21',
                '7': 'ZD22',
                '10': 'ZD23',
                '15': 'ZD24',
                '30': 'ZD03',
                '60': 'ZD05'
              }
            }
          },
          {
            key: 'Credit',
            value: {
              enabled: true,
              description: 'crédito simple a %TERM% días',
              dependsOnCreditLineStatus: true,
              displayAsPaymentOption: true,
              sapMethod: '',
              sapConditions: {
                '5': 'ZD18',
                '7': 'ZD25',
                '10': 'ZD19',
                '15': 'ZD20',
                '30': 'ZD07',
                '45': 'ZD08',
                '60': 'ZD09',
                '60G': 'ZD12',
                '75G': 'ZD13',
                '90G': 'ZD14',
                '120': 'ZD27'
              }
            }
          }
        ]
      });
    }
  })
};

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartsRepository, ChannelsRepository, CustomObjectsRepository, CustomersRepository } from 'commercetools-sdk-repositories';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { CommercetoolsExceptionFilter } from '@/common/filters/commercetools.exception.filter';
import { ApiErrorFilter } from '@/common/filters/api.exception.filter';
import { BusinessUnitCartsController } from '../business-unit-carts.controller';
import { BusinessUnitsService } from '@/business-unit/business-units.service';
import { BusinessUnitCartsService } from '../business-unit-carts.service';
import { mockCompanyBusinessUnit, mockConvertedBusinessUnit, mockCompanyBusinessUnitWithFullDeliveryZone } from '@/business-unit/__mocks__/business-units.mock';
import { CartsService } from '@/carts/carts.service';
import { mockAdelcoCartResponse, mockCommercetoolsCartResponse, mockCommercetoolsCartWithLineItemResponse } from '@/carts/__mock__/carts.mock';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { ProductsService } from '@/products/products.service';
import { CommercetoolsError } from '@/nest-commercetools';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { CartsHelperService } from '@/carts-helper/carts-helper.service';
import { ChannelsService } from '@/channels/channels.service';
import { IGetProductsDraftAndLineItemsIdsToDeleteRequest } from '@/carts-helper/carts-helper.interface';
import { register, unregister } from 'timezone-mock';
import { ValidatorService } from '@/common/validator/validator.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';
import { AddDeliveryDateDto } from '@/business-unit-carts/dto/delivery-dates.dto';
import { mockDeliveryZonesResponse, mockDeliveryZoneValue } from '@/delivery-zones/__mocks__/delivery-zones.mock';
import { TrimStringsPipe } from '@/common/transformer/trim-strings.pipe';
import { CustomersService } from '@/customers/customers.service';
import { NotificationsService } from '@/notifications';

describe('business-unit-carts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitCartsController],
      providers: [
        BusinessUnitCartsService,
        BusinessUnitsService,
        CartsService,
        ProductsService,
        DeliveryZonesService,
        CartsHelperService,
        ChannelsService,
        ValidatorService,
        PaymentsMethodsService,
        CustomersService,
        NotificationsService,
        {
          provide: CustomersRepository,
          useValue: {}
        },
        {
          provide: CustomObjectsRepository,
          useValue: mockCustomObjectsRepository
        },
        {
          provide: ChannelsRepository,
          useValue: mockChannelsRepository
        },
        {
          provide: CartsRepository,
          useValue: mockCartsRepository
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => {
              if (key === 'businessUnitsCarts.userHeaderId') return userHeaderId;
              if (key === 'businessUnitsCarts.userHeaderRoles') return userHeaderRoles;
              if (key === 'businessUnits.customerUrl') return 'https://test.com/v1/';

              return key;
            })
          }
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app
      .useGlobalFilters(new AllExceptionsFilter())
      .useGlobalFilters(new CommercetoolsExceptionFilter())
      .useGlobalFilters(new ApiErrorFilter())
      .useGlobalPipes(new TrimStringsPipe(), new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  describe('GET [/business-unit/:id/carts/active/delivery-dates]', () => {
    const xUserId = 'username';
    const xUserRole = '["Admin"]';

    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(() => {
      register('UTC');
    });

    afterAll(() => {
      unregister();
    });

    describe('Should return delivery dates correctly', () => {
      const url = `/business-unit/converted/carts/active/delivery-dates`;
      const mockDate = new Date('2023-08-14T12:00:00.000Z');
      const mockedDate = createMockedDate(mockDate);

      afterAll(() => {
        mockedDate.restore();
      });

      it('When frequency is W', () => {
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-08-18T12:00:00.000Z',
              endDateTime: '2023-08-18T12:00:00.000Z'
            },
            {
              startDateTime: '2023-08-25T12:00:00.000Z',
              endDateTime: '2023-08-25T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-01T12:00:00.000Z',
              endDateTime: '2023-09-01T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).set('x-user-roles', xUserRole).expect(200).expect(responseExpected);
      });

      it('When frequency is B1', () => {
        mockDeliveryZonesResponse.value.frequency = 'B1';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-08-25T12:00:00.000Z',
              endDateTime: '2023-08-25T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-08T12:00:00.000Z',
              endDateTime: '2023-09-08T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-22T12:00:00.000Z',
              endDateTime: '2023-09-22T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });

      it('When frequency is B2', () => {
        mockDeliveryZonesResponse.value.frequency = 'B2';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-08-18T12:00:00.000Z',
              endDateTime: '2023-08-18T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-01T12:00:00.000Z',
              endDateTime: '2023-09-01T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-15T12:00:00.000Z',
              endDateTime: '2023-09-15T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });

      it('When frequency is TR1', () => {
        mockDeliveryZonesResponse.value.frequency = 'TR1';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-08-18T12:00:00.000Z',
              endDateTime: '2023-08-18T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-08T12:00:00.000Z',
              endDateTime: '2023-09-08T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-29T12:00:00.000Z',
              endDateTime: '2023-09-29T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });

      it('When frequency is TR2', () => {
        mockDeliveryZonesResponse.value.frequency = 'TR2';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-08-25T12:00:00.000Z',
              endDateTime: '2023-08-25T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-15T12:00:00.000Z',
              endDateTime: '2023-09-15T12:00:00.000Z'
            },
            {
              startDateTime: '2023-10-06T12:00:00.000Z',
              endDateTime: '2023-10-06T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });

      it('When frequency is TR3', () => {
        mockDeliveryZonesResponse.value.frequency = 'TR3';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-09-01T12:00:00.000Z',
              endDateTime: '2023-09-01T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-22T12:00:00.000Z',
              endDateTime: '2023-09-22T12:00:00.000Z'
            },
            {
              startDateTime: '2023-10-13T12:00:00.000Z',
              endDateTime: '2023-10-13T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });

      it('When frequency is M1', () => {
        mockDeliveryZonesResponse.value.frequency = 'M1';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-09-08T12:00:00.000Z',
              endDateTime: '2023-09-08T12:00:00.000Z'
            },
            {
              startDateTime: '2023-10-06T12:00:00.000Z',
              endDateTime: '2023-10-06T12:00:00.000Z'
            },
            {
              startDateTime: '2023-11-03T12:00:00.000Z',
              endDateTime: '2023-11-03T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });

      it('When frequency is M2', () => {
        mockDeliveryZonesResponse.value.frequency = 'M2';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-08-18T12:00:00.000Z',
              endDateTime: '2023-08-18T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-15T12:00:00.000Z',
              endDateTime: '2023-09-15T12:00:00.000Z'
            },
            {
              startDateTime: '2023-10-13T12:00:00.000Z',
              endDateTime: '2023-10-13T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });

      it('When frequency is M3', () => {
        mockDeliveryZonesResponse.value.frequency = 'M3';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-08-25T12:00:00.000Z',
              endDateTime: '2023-08-25T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-22T12:00:00.000Z',
              endDateTime: '2023-09-22T12:00:00.000Z'
            },
            {
              startDateTime: '2023-10-20T12:00:00.000Z',
              endDateTime: '2023-10-20T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });

      it('When frequency is M4', () => {
        mockDeliveryZonesResponse.value.frequency = 'M4';
        const responseExpected = {
          deliveryDates: [
            {
              startDateTime: '2023-09-01T12:00:00.000Z',
              endDateTime: '2023-09-01T12:00:00.000Z'
            },
            {
              startDateTime: '2023-09-29T12:00:00.000Z',
              endDateTime: '2023-09-29T12:00:00.000Z'
            },
            {
              startDateTime: '2023-10-27T12:00:00.000Z',
              endDateTime: '2023-10-27T12:00:00.000Z'
            }
          ]
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(200).expect(responseExpected);
      });
    });

    describe('Should return an error', () => {
      it('should return a 400 error code "Bad Request" if not x-user-id is not provided', () => {
        const url = `/business-unit/123/carts/active/delivery-dates`;
        return request(app.getHttpServer()).get(url).expect(400).expect({ statusCode: 400, message: 'User ID missing' });
      });

      it('should throw businessUnitDoesNotExist', () => {
        const url = `/business-unit/error/carts/active/delivery-dates`;
        const errorExpected = {
          statusCode: 404,
          message: 'Business Unit not found'
        };

        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(404).expect(errorExpected);
      });

      it('should throw validation data structure error', async () => {
        mockConvertedBusinessUnit.deliveryZoneKey = 'incomplete';
        const url = `/business-unit/converted/carts/active/delivery-dates`;
        return request(app.getHttpServer()).get(url).set('x-user-id', xUserId).expect(400).expect({ statusCode: 400, message: 'Data structure validation does not pass' });
      });
    });
  });

  describe('GET /:id/carts/active', () => {
    const url = (buId: string, forceUpdate?: boolean) => `/business-unit/${buId}/carts/active${forceUpdate ? '?forceUpdate=true' : ''}`;

    describe('when success', () => {
      const xUserId = 'username@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer()).get(url('bu-id')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    describe('when success with role CSR', () => {
      const xUserId = 'username@username.com';
      const xUserRole = '["CSR"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ ...mockCompanyBusinessUnit, id: 'bu-id' })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer()).get(url('bu-id')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-user-id is not set', () => {
      const xUserRole = '["Admin"]';

      it('should throw BadRequestException with user id missing', () => {
        return request(app.getHttpServer()).get(url('bu-id')).set('x-user-roles', xUserRole).expect(400).expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when not has active cart', () => {
      const xUserId = 'nocart@nocart.com';
      const xUserRole = '["CSR"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should throw NotFoundException', () => {
        return request(app.getHttpServer())
          .get(url('bu-id'))
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(404)
          .expect({ statusCode: 404, message: 'Not active cart for this user.' });
      });
    });
  });

  describe('DELETE /:id/carts/active/line-items/:lineItemId', () => {
    const url = (buId: string, lineItemId: string, forceUpdate?: boolean) =>
      `/business-unit/${buId}/carts/active/line-items/${lineItemId}${forceUpdate ? '?forceUpdate=true' : ''}`;

    describe('when success', () => {
      const xUserId = 'usernameDeleteLineItem@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer()).delete(url('bu-id', 'lineItem-id')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    describe('when success with role CSR', () => {
      const xUserId = 'usernameDeleteLineItem@username.com';
      const xUserRole = '["CSR"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ ...mockCompanyBusinessUnit, id: 'bu-id' })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer()).delete(url('bu-id', 'lineItem-id')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-user-id is not set', () => {
      const xUserRole = '["Admin"]';

      it('should throw BadRequestException with user id missing', () => {
        return request(app.getHttpServer()).delete(url('bu-id', 'lineItem-id')).set('x-user-roles', xUserRole).expect(400).expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when cart not has line item', () => {
      const xUserId = 'username@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should throw NotFound when line item not find', () => {
        return request(app.getHttpServer())
          .delete(url('bu-id', 'differnt-line-item-id'))
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(404)
          .expect({ statusCode: 404, message: 'Line item not found' });
      });
    });
  });

  describe('PATCH /:id/carts/active/line-items/:lineItemId/quantity', () => {
    const url = (buId: string, lineItemId: string, forceUpdate?: boolean) =>
      `/business-unit/${buId}/carts/active/line-items/${lineItemId}/quantity${forceUpdate ? '?forceUpdate=true' : ''}`;

    describe('when success', () => {
      const xUserId = 'usernameUpdateQuantityLineItem@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .patch(url('bu-id', 'lineItem-id'))
          .send({ quantity: 5 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(200)
          .expect(mockAdelcoCartResponse);
      });
    });

    describe('when success with role CSR', () => {
      const xUserId = 'usernameUpdateQuantityLineItem@username.com';
      const xUserRole = '["CSR"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ ...mockCompanyBusinessUnit })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .patch(url('bu-id', 'lineItem-id'))
          .send({ quantity: 5 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(200)
          .expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-user-id is not set', () => {
      const xUserRole = '["Admin"]';

      it('should throw BadRequestException with user id missing', () => {
        return request(app.getHttpServer())
          .patch(url('bu-id', 'lineItem-id'))
          .send({ quantity: 5 })
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when cart not has line item', () => {
      const xUserId = 'username@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should throw NotFound when line item not find', () => {
        return request(app.getHttpServer())
          .patch(url('bu-id', 'differnt-line-item-id'))
          .send({ quantity: 5 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(404)
          .expect({ statusCode: 404, message: 'Line item not found' });
      });
    });
  });

  describe('POST /:id/carts/active/line-items', () => {
    const url = (buId: string, forceUpdate?: boolean) => `/business-unit/${buId}/carts/active/line-items${forceUpdate ? '?forceUpdate=true' : ''}`;

    describe('when success', () => {
      const xUserId = 'usernameAddLineItem@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(201)
          .expect(mockAdelcoCartResponse);
      });
    });

    describe('when success with role CSR', () => {
      const xUserId = 'usernameAddLineItem@username.com';
      const xUserRole = '["CSR"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ ...mockCompanyBusinessUnit })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(201)
          .expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-user-id is not set', () => {
      const xUserRole = '["Admin"]';

      it('should throw BadRequestException with user id missing', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when attempting to add wrong item', () => {
      const xUserId = 'username@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete.mockImplementationOnce(() => {
          throw new NotFoundException('Product not found');
        });
      });

      it('should throw NotFound when line item not found', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ sku: 'no-match-sku', quantity: 1 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(404)
          .expect({ statusCode: 404, message: 'Product not found' });
      });
    });

    describe('when quantity exceeds inventory', () => {
      const xUserId = 'username@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete.mockImplementationOnce(() => {
          throw new BadRequestException('Product is not on stock or there are not enough units');
        });
      });

      it('should throw NotFound when line item not found', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ sku: 'sku1', quantity: 500 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Product is not on stock or there are not enough units' });
      });
    });

    describe('when product has no availability', () => {
      const xUserId = 'usernameAddLineItem@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete.mockImplementationOnce(() => {
          throw new BadRequestException('Unable to determine product stock');
        });
      });

      it('should throw NotFound when line item not found', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ sku: 'no-availability', quantity: 1 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Unable to determine product stock' });
      });
    });

    describe('when cannot determine price', () => {
      const xUserId = 'norate@mail.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-rate' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete.mockImplementationOnce(() => {
          throw new BadRequestException('Delivery zone missing data');
        });
      });

      it('should throw NotFound when line item not found', () => {
        return request(app.getHttpServer())
          .post(url('bu-id-no-rate'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Delivery zone missing data' });
      });
    });

    describe('when cannot determine price', () => {
      const xUserId = 'nozone@mail.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-zone' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockBusinessUnitsService.findBusinessUnitByIdAndCustomer.mockImplementationOnce(() => {
          throw new BadRequestException('Business unit missing delivery zone');
        });
      });

      it('should throw NotFound when line item not found', () => {
        return request(app.getHttpServer())
          .post(url('bu-id-no-zone'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Business unit missing delivery zone' });
      });
    });

    describe('when product has no base price', () => {
      const xUserId = 'no-price@mail.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-price' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockBusinessUnitsService.findBusinessUnitByIdAndCustomer.mockImplementationOnce(() => {
          throw new BadRequestException('Missing price for product');
        });
      });

      it('should throw NotFound when line item not found', () => {
        return request(app.getHttpServer())
          .post(url('bu-id-no-price'))
          .send({ sku: 'no-price', quantity: 1 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Missing price for product' });
      });
    });

    describe('when cannot determine price', () => {
      const xUserId = 'nodc@mail.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-dc' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockBusinessUnitsService.findBusinessUnitByIdAndCustomer.mockImplementationOnce(() => {
          throw new BadRequestException('Business unit missing distribution channel');
        });
      });

      it('should throw NotFound when line item not found', () => {
        return request(app.getHttpServer())
          .post(url('bu-id-no-dc'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Business unit missing distribution channel' });
      });
    });
  });

  describe('DELETE /:id/carts/active', () => {
    const url = (buId: string) => `/business-unit/${buId}/carts/active`;

    describe('when success', () => {
      const xUserId = 'usernameDeleteLineItem@username.com';
      const xUserRole = '["Admin"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return OK', () => {
        return request(app.getHttpServer()).delete(url('bu-id')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).expect(204);
      });
    });

    describe('when header x-user-id is not set', () => {
      const xUserRole = '["Admin"]';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw BadRequestException with user id missing', () => {
        return request(app.getHttpServer()).delete(url('bu-id')).set('x-user-roles', xUserRole).expect(400).expect({ statusCode: 400, message: 'User ID missing' });
      });
    });
  });

  describe('POST /:id/sync-cart', () => {
    const url = (buId: string) => `/business-unit/${buId}/sync-cart`;

    beforeAll(() => {
      mockBusinessUnitsService.getBusinessUnitById.mockImplementationOnce(() => {
        return Promise.resolve({ deliveryZoneKey: 'devlieryZoneKey', distributionChannelId: 'distributionChannelId', key: 'key', taxProfile: 'taxProfile' });
      });
    });

    describe('when success', () => {
      // TODO: It is failing because we are not cleaning up the previous mocks properly.
      // TODO: Anyway it is wrongly mocked and we have to make a refactor in this e2e because we should have mocked fetch and calls to commercetools and it mocked services.
      const xUserId = 'usernameAddLineItem@username.com';
      const xUserRole = '["__INTERNAL__"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(201)
          .expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-user-id is not set', () => {
      const xUserRole = '["__INTERNAL__"]';

      it('should throw BadRequestException with user id missing', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' })
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when header x-user-roles is not set', () => {
      const xUserId = 'usernameAddLineItem@username.com';

      it('should throw BadRequestException with user roles missing', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' })
          .set('x-user-id', xUserId)
          .expect(400)
          .expect({ statusCode: 400, message: 'User roles missing' });
      });
    });

    describe('when header x-user-roles is not valid', () => {
      const xUserId = 'usernameAddLineItem@username.com';
      const xUserRole = '["NO_VALID"]';

      it('should throw ForbiddenException with Insufficient permissions', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(403)
          .expect({ statusCode: 403, message: 'Insufficient permissions' });
      });
    });

    describe('when attempting to add wrong item', () => {
      const xUserId = 'username@username.com';
      const xUserRole = '["__INTERNAL__"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete.mockImplementationOnce(() => {
          throw new NotFoundException('Product not found');
        });
      });

      it('should throw NotFound when line item not found', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(404)
          .expect({ statusCode: 404, message: 'Product not found' });
      });
    });

    describe('when quantity exceeds inventory', () => {
      const xUserId = 'username@username.com';
      const xUserRole = '["__INTERNAL__"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete.mockImplementationOnce(() => {
          throw new BadRequestException('Product is not on stock or there are not enough units');
        });
      });

      it('should throw BadRequestException product is not on stock or there are not enough units', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Product is not on stock or there are not enough units' });
      });
    });

    describe('when product has no availability', () => {
      const xUserId = 'usernameAddLineItem@username.com';
      const xUserRole = '["__INTERNAL__"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete.mockImplementationOnce(() => {
          throw new BadRequestException('Unable to determine product stock');
        });
      });

      it('should throw BadRequestException unable to determine product stock', () => {
        return request(app.getHttpServer())
          .post(url('bu-id'))
          .send({ lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Unable to determine product stock' });
      });
    });

    describe('when delivery zone missing data', () => {
      const xUserId = 'norate@mail.com';
      const xUserRole = '["__INTERNAL__"]';

      beforeAll(() => {
        const assetsFetchMock = (): Promise<Response> => {
          return {
            ok: true,
            status: 200,
            json: async () => Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id-no-rate' }] })
          } as unknown as Promise<Response>;
        };
        jest.spyOn(global, 'fetch').mockImplementationOnce(assetsFetchMock);
        mockCartsHelperService.getProductsDraftAndLineItemsIdsToDelete.mockImplementationOnce(() => {
          throw new BadRequestException('Delivery zone missing data');
        });
      });

      it('should throw BadRequestException delivery zone missing data', () => {
        return request(app.getHttpServer())
          .post(url('bu-id-no-rate'))
          .send({ lineItems: [{ sku: 'sku', quantity: 1 }], discountCodes: ['DISCOUNT'], paymentMethod: 'Payment' })
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'Delivery zone missing data' });
      });
    });
  });

  describe('DELETE /:businessUnitId/carts/active/discount-code/:discountCodeToRemove', () => {
    const url = (buId: string, discountCodeToRemove: string, forceUpdate?: boolean) =>
      `/business-unit/${buId}/carts/active/discount-code/${discountCodeToRemove}${forceUpdate ? '?forceUpdate=true' : ''}`;

    beforeEach(() => {
      mockBusinessUnitsService.getBusinessUnitById.mockImplementationOnce(() => {
        return Promise.resolve({ id: 'bu-id' });
      });
    });

    describe('when success', () => {
      const xUserId = 'usernameDeleteDiscountCode@username.com';
      const xUserRole = '["Admin"]';

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .delete(url('bu-id', 'code-to-remove'))
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(200)
          .expect(mockAdelcoCartResponse);
      });
    });

    describe('when success with role CSR', () => {
      const xUserId = 'usernameDeleteDiscountCode@username.com';
      const xUserRole = '["CSR"]';

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .delete(url('bu-id', 'code-to-remove'))
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .expect(200)
          .expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-user-id is not set', () => {
      const xUserRole = '["Admin"]';

      it('should throw BadRequestException with user id missing', () => {
        return request(app.getHttpServer())
          .delete(url('bu-id', 'discount-code'))
          .set('x-user-roles', xUserRole)
          .expect(400)
          .expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when cart does not have discount code', () => {
      const xUserId = 'usernameDeleteDiscountCode@username.com';
      const xUserRole = '["Admin"]';

      it('should throw NotFound when discount code not found', () => {
        return request(app.getHttpServer()).delete(url('bu-id', 'other-code')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).expect(404).expect({
          statusCode: 404,
          message: 'Discount code does not exist',
          code: 'Carts-027'
        });
      });
    });
  });

  describe('PATH /:businessUnitId/carts/active/discount-code', () => {
    const url = (buId: string, forceUpdate?: boolean) => `/business-unit/${buId}/carts/active/discount-code${forceUpdate ? '?forceUpdate=true' : ''}`;
    const body = {
      code: 'code-to-add'
    };

    beforeEach(() => {
      mockBusinessUnitsService.getBusinessUnitById.mockImplementationOnce(() => {
        return Promise.resolve({ id: 'bu-id' });
      });
    });

    describe('when success', () => {
      const xUserId = 'usernameDeleteDiscountCode@username.com';
      const xUserRole = '["Admin"]';

      it('should return an active cart', () => {
        return request(app.getHttpServer()).patch(url('bu-id')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).send(body).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    describe('when success with role CSR', () => {
      const xUserId = 'usernameDeleteDiscountCode@username.com';
      const xUserRole = '["CSR"]';

      it('should return an active cart', () => {
        return request(app.getHttpServer()).patch(url('bu-id')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).send(body).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-user-id is not set', () => {
      const xUserRole = '["Admin"]';

      it('should throw BadRequestException with user id missing', () => {
        return request(app.getHttpServer()).patch(url('bu-id')).set('x-user-roles', xUserRole).send(body).expect(400).expect({ statusCode: 400, message: 'User ID missing' });
      });
    });
  });

  describe('PATCH :businessUnitId/carts/active/delivery-dates', () => {
    const url = (buId: string) => `/business-unit/${buId}/carts/active/delivery-dates`;
    const xUserRole = '["__INTERNAL__"]';
    const xUserId = 'userId';
    const body: AddDeliveryDateDto = {
      date: '2023-08-31T19:05:37.676Z'
    };

    describe('When success', () => {
      it('should return an updated cart', () => {
        return request(app.getHttpServer()).patch(url('bu-id')).set('x-user-id', xUserId).set('x-user-roles', xUserRole).send(body).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    it('should return NotFoundException does not exist active cart for the user', () => {
      const xUserId = 'nocart@nocart.com';
      return request(app.getHttpServer())
        .patch(url('bu-id'))
        .set('x-user-id', xUserId)
        .set('x-user-roles', xUserRole)
        .send(body)
        .expect(404)
        .expect({ statusCode: 404, message: 'Not active cart for this user.' });
    });

    describe('Should return BadRequestException', () => {
      it('when x-user-id is not provided', () => {
        return request(app.getHttpServer()).patch(url('bu-id')).set('x-user-roles', xUserRole).send(body).expect(400).expect({ statusCode: 400, message: 'User ID missing' });
      });

      it('when payload does not have the correct structure', () => {
        body.date = '123';
        return request(app.getHttpServer())
          .patch(url('bu-id'))
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRole)
          .send(body)
          .expect(400)
          .expect({ statusCode: 400, message: ['date must be a valid ISO 8601 date string'] });
      });
    });
  });

  describe('GET /:id/active/payment-methods', () => {
    const url = '/business-unit/bu-id/active/payment-methods';
    const xUserId = 'with-credit@mail.com';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a 400 error code "Bad Request" if not x-user-id is not provided', () => {
      return request(app.getHttpServer()).get(url).expect(400).expect({ statusCode: 400, message: 'User ID missing' });
    });

    it('should return a list of payments methods', () => {
      return request(app.getHttpServer())
        .get(url)
        .set('x-user-id', xUserId)
        .expect(200)
        .expect({
          paymentMethods: [
            {
              key: 'BankTransfer',
              description: 'Transferencia',
              condition: 'ZD16',
              termDays: 0
            },
            {
              key: 'Cash',
              description: 'Efectivo',
              condition: 'ZD01',
              termDays: 0
            },
            {
              key: 'DayCheck',
              description: 'Cheque al día',
              condition: 'ZD02',
              termDays: 1
            },
            {
              key: 'DateCheck',
              description: 'Cheque a fecha a 30 días',
              condition: 'ZD03',
              termDays: 30
            },
            {
              key: 'Credit',
              description: 'crédito simple a 30 días',
              condition: 'ZD07',
              termDays: 30
            }
          ]
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

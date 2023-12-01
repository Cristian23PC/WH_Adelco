const mockBusinessUnitsRepository = {
  find: jest.fn((methodArgs: { queryArgs: { where: string[] } }) => {
    const where = methodArgs.queryArgs.where;
    if (where[0] === 'custom(fields(rut=error))' || where[0].indexOf('not-found') >= 0) {
      return Promise.resolve({ total: 0, results: [] });
    }
    if (where[0].indexOf('error') >= 0) {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorMalformed));
    }
    if (where[0].indexOf('parentUnit') >= 0 || where[0].indexOf('division') >= 0 || where[0].indexOf('rut') >= 0) {
      return Promise.resolve({
        total: 60,
        results: [mockDivisionBusinessUnit]
      });
    }
    if (methodArgs.queryArgs.where[0].indexOf('by-group') >= 0) {
      return Promise.resolve({
        total: 1,
        results: [mockBusinessUnitByGroup]
      });
    }
    if (methodArgs.queryArgs.where[0].indexOf('subchannel') >= 0) {
      return Promise.resolve({
        total: 1,
        results: [mockBusinessUnitSubchannel]
      });
    }
    if (methodArgs.queryArgs.where[0].indexOf('otherSubchannel') >= 0) {
      return Promise.resolve({
        total: 1,
        results: [mockBusinessUnitDifferentSubchannel]
      });
    }
    if (methodArgs.queryArgs.where[0].indexOf('missingDC') >= 0) {
      return Promise.resolve({
        total: 1,
        results: [mockBusinessUnitMissingDC]
      });
    }
    if (methodArgs.queryArgs.where[0].indexOf('customerTwoDivision') >= 0) {
      return Promise.resolve({
        total: 1,
        results: [mockDivisionBusinessUnit, { ...mockDivisionBusinessUnit, id: 'div-id2' }]
      });
    }
    return Promise.resolve({
      total: 1,
      results: [mockCompanyBusinessUnit]
    });
  }),
  getById: jest.fn((id: string) => {
    if (id === 'error') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorNotFound));
    }
    if (id === 'update-id') {
      return Promise.resolve(mockCompanyBusinessUnitWithAssociatesExpanded);
    }
    if (id === 'failure-id') {
      return Promise.resolve({
        ...mockCompanyBusinessUnit,
        associates: [
          {
            customer: {
              typeId: 'customer',
              id: 'customerId',
              obj: {
                email: 'another@user.com',
                id: '',
                version: 0,
                createdAt: '',
                lastModifiedAt: '',
                addresses: [],
                isEmailVerified: false,
                authenticationMode: ''
              }
            },
            associateRoleAssignments: [
              {
                associateRole: {
                  key: BU_ADMIN_ROLE
                }
              }
            ]
          }
        ]
      } as any);
    }
    return Promise.resolve(mockCompanyBusinessUnit);
  }),
  updateById: jest.fn((id: string) => {
    if (id === 'error') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorNotFound));
    }

    return mockCompanyBusinessUnit;
  }),
  create: jest.fn((request: { body: BusinessUnitDraft }) => {
    if (request.body.key === 'invalid') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorMalformed));
    }

    return Promise.resolve(mockCompanyBusinessUnit);
  }),
  getByKey: jest.fn((key: string) => {
    if (key === 'error') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorNotFound));
    }
    if (key === 'company-sap-key') {
      return Promise.resolve({
        ...mockCompanyBusinessUnit,
        custom: {
          fields: {
            externalId: 'company-sap-id'
          }
        }
      });
    }

    return Promise.resolve(mockCompanyBusinessUnit);
  }),
  deleteById: jest.fn(() => Promise.resolve(mockCompanyBusinessUnit))
};

const mockChannelsRepository = {
  find: jest.fn((methodArgs: { queryArgs: { where: string[]; limit: number } }) => {
    if (methodArgs.queryArgs.where[1].indexOf('MISSING_DC') >= 0) {
      return Promise.resolve({
        results: []
      });
    } else if (methodArgs.queryArgs.where[1].indexOf('CHANNEL_SUBCHANNEL') >= 0) {
      return Promise.resolve({
        results: [mockChannelTraditional, mockChannelSubchannel]
      });
    } else {
      return Promise.resolve({
        results: [mockChannelTraditional, mockChannelCustomer]
      });
    }
  })
};

const mockDeliveryZonesService = {
  getDeliveryZonesByLocality: jest.fn((locality: string) => {
    if (locality === 'no-locality') {
      return Promise.reject(new NotFoundException());
    }
    return Promise.resolve(mockDeliveryZonesResponse);
  })
};

const mockSequenceService = {
  getBusinessUnitKey: jest.fn().mockImplementation(() => '6000001')
};

const mockCustomersService = {
  createCustomer: jest.fn().mockImplementation(() => ({ customer: mockCommercetoolsCustomerResponse })),
  getCustomerByEmail: jest.fn()
};

jest.mock('@/nest-commercetools/repositories/business-units', () => ({
  BusinessUnitsRepository: jest.fn().mockImplementation(() => mockBusinessUnitsRepository)
}));

jest.mock('commercetools-sdk-repositories', () => ({
  ChannelsRepository: jest.fn().mockImplementation(() => mockChannelsRepository)
}));

jest.mock('@/delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZonesService)
}));

jest.mock('@/sequence/sequence.service', () => ({
  SequenceService: jest.fn().mockImplementation(() => mockSequenceService)
}));

jest.mock('@/customers/customers.service', () => ({
  CustomersService: jest.fn().mockImplementation(() => mockCustomersService)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { ConvertedBusinessUnit } from '../models';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { BusinessUnitsService, TDivisionHeaders } from '../business-units.service';
import {
  mockCompanyBusinessUnit,
  mockDivisionBusinessUnit,
  mockBusinessUnitByGroup,
  mockBusinessUnitSubchannel,
  mockBusinessUnitDifferentSubchannel,
  mockBusinessUnitMissingDC,
  mockCompanyBusinessUnitWithAssociatesExpanded,
  responseBusinessUnitActions,
  requestBusinessUnitMock,
  responseMinimumBusinessUnitActions,
  filterGetAllBusinessUnitsMock,
  mockBusinessUnitList,
  mocktFindBusinessUnit,
  mocktFindBusinessUnitCustomNull
} from '../__mocks__/business-units.mock';
import { mockChannelTraditional, mockChannelCustomer, mockChannelSubchannel } from '../__mocks__/channels.mock';
import { ChannelsRepository } from 'commercetools-sdk-repositories';
import { BusinessUnit, BusinessUnitDraft, BusinessUnitAddAddressAction, BusinessUnitUpdateAction } from '@commercetools/platform-sdk';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { mockDeliveryZonesResponse } from '@/delivery-zones/__mocks__/delivery-zones.mock';
import { CreateDivisionRequestDto } from '../dto/division.dto';
import { BU_ADMIN_ROLE, CSR_ROLE, INTERNAL_ROLE } from '@/common/constants/roles';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { mockCommercetoolsCustomerResponse, mockCommercetoolsErrorMalformed, mockCommercetoolsErrorNotFound } from '@/business-units-users/__mocks__/business-units-users.mock';
import { ConfigService } from '@nestjs/config';
import { SequenceService } from '@/sequence/sequence.service';
import { EBusinessUnitsSortField } from '../enum/business-units-sort-field.enum';
import { CustomersService } from '@/customers/customers.service';
import { BusinessUnitsHelper } from '@/common/helpers/business-units/business-units.helper';

const logger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

jest.mock('@/common/utils/logger/logger.service', () => ({
  LoggerService: jest.fn(() => logger)
}));

describe('BusinessUnitsService', () => {
  let service: BusinessUnitsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryZonesService,
        BusinessUnitsService,
        BusinessUnitsRepository,
        ChannelsRepository,
        SequenceService,
        BusinessUnitsHelper,
        CustomersService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => {
              if (key === 'common.minimumOrderCentAmount') {
                return '5000';
              }
              if (key === 'businessUnits.divisionLimit') {
                return '50';
              }
              return null;
            })
          }
        }
      ]
    }).compile();

    service = module.get<BusinessUnitsService>(BusinessUnitsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findBusinessUnits', () => {
    let response: HttpException | CommercetoolsError;

    describe('when success', () => {
      let expectedResponse;
      let res: { businessUnits: Partial<ConvertedBusinessUnit>[] };

      describe('when customer business units are found', () => {
        describe('when the requested business unit is a Company', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: [mockCompanyBusinessUnit, mockDivisionBusinessUnit]
            };
            res = (await service.findBusinessUnits('customerId')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
          });

          it('should call ChannelssRepository.find for customerId', () => {
            expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
              queryArgs: { where: [`associates(customer(id="customerId"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
            });
          });

          it('should call BusinessUnitsRepository.find for customerId', () => {
            expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
              queryArgs: { where: [`associates(customer(id="customerId"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
            });
          });

          it('should call BusinessUnitsRepository.find for divisions', () => {
            expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(2, {
              queryArgs: {
                where: [`parentUnit(key="key")`],
                expand: ['associates[*].customer', 'custom.fields.deliveryZone'],
                limit: 50
              }
            });
          });

          it('should return CustomersPagedQueryResponse with results', () => {
            expect(res.businessUnits.sort()).toEqual(
              expectedResponse.businessUnits.sort().map(bu =>
                bu.unitType === 'Company'
                  ? {
                      ...bu,
                      custom: undefined,
                      rut: '123456789',
                      deliveryZoneKey: bu.custom?.fields.deliveryZone?.obj.key,
                      distributionChannelId: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
                      taxProfile: '1',
                      shouldApplyT2Rate: true,
                      externalId: 'sap_buid',
                      distributionCenter: 'COMPANY_DC',
                      customerGroupCode: 'TRADICIONAL',
                      t2Rate: '0.12',
                      tradeName: undefined,
                      minimumOrderAmount: {
                        centAmount: 5000,
                        currencyCode: 'CLP',
                        fractionDigits: 0,
                        type: 'string'
                      },
                      isCreditEnabled: true,
                      isCreditBlocked: true,
                      creditLimit: 1000,
                      creditExcessTolerance: 500,
                      creditTermDays: 30
                    }
                  : {
                      ...bu,
                      custom: undefined,
                      rut: 'rut',
                      deliveryZoneKey: undefined,
                      distributionChannelId: undefined,
                      taxProfile: undefined,
                      shouldApplyT2Rate: undefined,
                      distributionCenter: undefined,
                      customerGroupCode: undefined,
                      t2Rate: undefined,
                      tradeName: undefined,
                      creditExcessTolerance: undefined,
                      creditLimit: undefined,
                      creditTermDays: undefined,
                      deliveryZone: undefined,
                      externalId: undefined,
                      isCreditBlocked: undefined,
                      isCreditEnabled: undefined,
                      minimumOrderAmount: {
                        centAmount: 5000,
                        currencyCode: 'CLP',
                        fractionDigits: 0,
                        type: 'string'
                      }
                    }
              )
            );
          });
        });

        describe('when the requested business unit is a Company and have more than 50 division as childrens', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: [mockCompanyBusinessUnit, mockDivisionBusinessUnit]
            };
            res = (await service.findBusinessUnits('manyChildrens')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
          });

          it('should log an error', () => {
            expect(logger.error).toHaveBeenCalledWith(`There are more than 50 division`);
          });
        });

        describe('when the requested business unit is a Division', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: [mockDivisionBusinessUnit]
            };
            res = (await service.findBusinessUnits('division')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
          });

          it('should call BusinessUnitsRepository.find for customerId', () => {
            expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
              queryArgs: { where: [`associates(customer(id="division"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
            });
          });

          it('should return CustomersPagedQueryResponse with results', () => {
            expect(res.businessUnits.sort()).toEqual(
              expectedResponse.businessUnits.sort().map(bu => ({
                ...bu,
                custom: undefined,
                rut: 'rut',
                deliveryZoneKey: undefined,
                distributionChannelId: undefined,
                taxProfile: undefined,
                shouldApplyT2Rate: undefined,
                externalId: undefined,
                distributionCenter: undefined,
                customerGroupCode: undefined,
                t2Rate: undefined,
                tradeName: undefined,
                minimumOrderAmount: {
                  centAmount: 5000,
                  currencyCode: 'CLP',
                  fractionDigits: 0,
                  type: 'string'
                }
              }))
            );
          });
        });
      });

      describe('when the request return two divisions', () => {
        describe('when the requested business unit is a Company', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: [mockCompanyBusinessUnit, mockDivisionBusinessUnit]
            };
            res = (await service.findBusinessUnits('customerTwoDivision')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
          });

          it('should call ChannelssRepository.find for customerId', () => {
            expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
              queryArgs: { where: [`associates(customer(id="customerTwoDivision"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
            });
          });

          it('should call BusinessUnitsRepository.find for customerId', () => {
            expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
              queryArgs: { where: [`associates(customer(id="customerTwoDivision"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
            });
          });

          it('should return CustomersPagedQueryResponse with results', () => {
            expect(res.businessUnits.sort()).toEqual(
              [mockDivisionBusinessUnit, { ...mockDivisionBusinessUnit, id: 'div-id2' }].map(bu => ({
                ...bu,
                custom: undefined,
                rut: 'rut',
                deliveryZoneKey: undefined,
                distributionChannelId: undefined,
                taxProfile: undefined,
                shouldApplyT2Rate: undefined,
                externalId: undefined,
                distributionCenter: undefined,
                customerGroupCode: undefined,
                t2Rate: undefined,
                tradeName: undefined,
                minimumOrderAmount: {
                  centAmount: 5000,
                  currencyCode: 'CLP',
                  fractionDigits: 0,
                  type: 'string'
                }
              }))
            );
          });
        });

        describe('when the requested business unit is a Company and have more than 50 division as childrens', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: [mockCompanyBusinessUnit, mockDivisionBusinessUnit]
            };
            res = (await service.findBusinessUnits('manyChildrens')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
          });

          it('should log an error', () => {
            expect(logger.error).toHaveBeenCalledWith(`There are more than 50 division`);
          });
        });

        describe('when the requested business unit is a Division', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: [mockDivisionBusinessUnit]
            };
            res = (await service.findBusinessUnits('division')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
          });

          it('should call BusinessUnitsRepository.find for customerId', () => {
            expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
              queryArgs: { where: [`associates(customer(id="division"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
            });
          });

          it('should return CustomersPagedQueryResponse with results', () => {
            expect(res.businessUnits.sort()).toEqual(
              expectedResponse.businessUnits.sort().map(bu => ({
                ...bu,
                custom: undefined,
                rut: 'rut',
                deliveryZoneKey: undefined,
                distributionChannelId: undefined,
                taxProfile: undefined,
                shouldApplyT2Rate: undefined,
                externalId: undefined,
                distributionCenter: undefined,
                customerGroupCode: undefined,
                t2Rate: undefined,
                tradeName: undefined,
                minimumOrderAmount: {
                  centAmount: 5000,
                  currencyCode: 'CLP',
                  fractionDigits: 0,
                  type: 'string'
                }
              }))
            );
          });
        });
      });

      describe('when the requested business unit has a distributed channel by customer group', () => {
        let ctBUs;

        beforeEach(async () => {
          ctBUs = {
            businessUnits: [mockBusinessUnitByGroup]
          };
          res = (await service.findBusinessUnits('by-group')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
        });

        it('should call ChannelssRepository.find for customerId', () => {
          expect(mockChannelsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: {
              where: [
                'roles contains any ("ProductDistribution")',
                `custom(fields(distributionCenterCode="${mockBusinessUnitByGroup.custom?.fields.deliveryZone.obj.value.dcCode}"))`
              ],
              limit: 500
            }
          });
        });

        it('should return CustomersPagedQueryResponse with results including channel matched by BU group', () => {
          expect(res.businessUnits[0]).toEqual({
            ...ctBUs.businessUnits[0],
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: '991eed74-f30a-4be6-9bf2-93af3d1ed35e',
            rut: undefined,
            taxProfile: '1',
            shouldApplyT2Rate: false,
            externalId: 'sap_buid2',
            distributionCenter: 'COMPANY_DC',
            customerGroupCode: 'TRADICIONAL',
            t2Rate: '0.12',
            tradeName: undefined,
            minimumOrderAmount: {
              centAmount: 5000,
              currencyCode: 'CLP',
              fractionDigits: 0,
              type: 'string'
            },
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30
          });
        });
      });

      describe('when the requested business unit has a distributed channel by sub-chnanel', () => {
        let ctBUs;

        beforeEach(async () => {
          ctBUs = {
            businessUnits: [mockBusinessUnitSubchannel]
          };
          res = (await service.findBusinessUnits('subchannel')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
        });

        it('should call ChannelssRepository.find for customerId', () => {
          expect(mockChannelsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: {
              where: [
                'roles contains any ("ProductDistribution")',
                `custom(fields(distributionCenterCode="${mockBusinessUnitSubchannel.custom?.fields.deliveryZone.obj.value.dcCode}"))`
              ],
              limit: 500
            }
          });
        });

        it('should return CustomersPagedQueryResponse with results including channel matched by BU group', () => {
          expect(res.businessUnits[0]).toEqual({
            ...ctBUs.businessUnits[0],
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: '221eed74-f30a-4be6-9bf2-93af3d1ed35e',
            rut: undefined,
            taxProfile: '1',
            shouldApplyT2Rate: true,
            externalId: 'sap_buid',
            distributionCenter: 'CHANNEL_SUBCHANNEL',
            customerGroupCode: 'INSTITUCIONES',
            t2Rate: '0.12',
            tradeName: undefined,
            minimumOrderAmount: {
              centAmount: 5000,
              currencyCode: 'CLP',
              fractionDigits: 0,
              type: 'string'
            },
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30
          });
        });
      });

      describe('when the requested business unit has a distributed channel by chnanel, not matching subchannel', () => {
        let ctBUs;

        beforeEach(async () => {
          ctBUs = {
            businessUnits: [mockBusinessUnitDifferentSubchannel]
          };
          res = (await service.findBusinessUnits('otherSubchannel')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
        });

        it('should call ChannelssRepository.find for customerId', () => {
          expect(mockChannelsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: {
              where: [
                'roles contains any ("ProductDistribution")',
                `custom(fields(distributionCenterCode="${mockBusinessUnitDifferentSubchannel.custom?.fields.deliveryZone.obj.value.dcCode}"))`
              ],
              limit: 500
            }
          });
        });

        it('should return CustomersPagedQueryResponse with results including channel matched by BU group', () => {
          expect(res.businessUnits[0]).toEqual({
            ...ctBUs.businessUnits[0],
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: undefined,
            rut: undefined,
            taxProfile: '1',
            shouldApplyT2Rate: true,
            externalId: 'sap_buid',
            distributionCenter: 'CHANNEL_SUBCHANNEL',
            customerGroupCode: 'INSTITUCIONES',
            t2Rate: '0.12',
            tradeName: undefined,
            minimumOrderAmount: {
              centAmount: 5000,
              currencyCode: 'CLP',
              fractionDigits: 0,
              type: 'string'
            },
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30
          });
        });
      });

      describe('when the requested business unit has a distributed channel by sales channel', () => {
        let ctBUs;

        beforeEach(async () => {
          ctBUs = {
            businessUnits: [mockCompanyBusinessUnit]
          };
          res = (await service.findBusinessUnits('customerId')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
        });

        it('should call ChannelssRepository.find for customerId', () => {
          expect(mockChannelsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: {
              where: [
                'roles contains any ("ProductDistribution")',
                `custom(fields(distributionCenterCode="${mockCompanyBusinessUnit.custom?.fields.deliveryZone.obj.value.dcCode}"))`
              ],
              limit: 500
            }
          });
        });

        it('should return CustomersPagedQueryResponse with results including channel matched by BU group', () => {
          expect(res.businessUnits[0]).toEqual({
            ...ctBUs.businessUnits[0],
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
            rut: '123456789',
            taxProfile: '1',
            shouldApplyT2Rate: true,
            externalId: 'sap_buid',
            distributionCenter: 'COMPANY_DC',
            customerGroupCode: 'TRADICIONAL',
            t2Rate: '0.12',
            tradeName: undefined,
            minimumOrderAmount: {
              centAmount: 5000,
              currencyCode: 'CLP',
              fractionDigits: 0,
              type: 'string'
            },
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30
          });
        });
      });

      describe('when the requested business unit has no delivery zone', () => {
        let ctBUs;

        beforeEach(async () => {
          ctBUs = {
            businessUnits: [mockDivisionBusinessUnit]
          };
          res = (await service.findBusinessUnits('division')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
        });

        it('should call ChannelssRepository.find for customerId', () => {
          expect(mockChannelsRepository.find).not.toHaveBeenCalled();
        });

        it('should return CustomersPagedQueryResponse with results including channel matched by BU group', () => {
          expect(res.businessUnits[0]).toEqual({
            ...ctBUs.businessUnits[0],
            custom: undefined,
            rut: 'rut',
            deliveryZoneKey: undefined,
            distributionChannelId: undefined,
            taxProfile: undefined,
            shouldApplyT2Rate: undefined,
            minimumOrderAmount: {
              centAmount: 5000,
              currencyCode: 'CLP',
              fractionDigits: 0,
              type: 'string'
            }
          });
        });
      });

      describe('when the requested business unit has a missing distribution center', () => {
        let ctBUs;

        beforeEach(async () => {
          ctBUs = {
            businessUnits: [mockBusinessUnitMissingDC]
          };
          res = (await service.findBusinessUnits('missingDC')) as { businessUnits: Partial<ConvertedBusinessUnit>[] };
        });

        it('should call ChannelssRepository.find for customerId', () => {
          expect(mockChannelsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: {
              where: [
                'roles contains any ("ProductDistribution")',
                `custom(fields(distributionCenterCode="${mockBusinessUnitMissingDC.custom?.fields.deliveryZone.obj.value.dcCode}"))`
              ],
              limit: 500
            }
          });
        });

        it('should return CustomersPagedQueryResponse with results including channel matched by BU group', () => {
          expect(res.businessUnits[0]).toEqual({
            ...ctBUs.businessUnits[0],
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: undefined,
            rut: undefined,
            taxProfile: '1',
            shouldApplyT2Rate: false,
            externalId: 'sap_buid',
            distributionCenter: 'MISSING_DC',
            customerGroupCode: 'TRADICIONAL',
            t2Rate: '0.12',
            tradeName: undefined,
            minimumOrderAmount: {
              centAmount: 5000,
              currencyCode: 'CLP',
              fractionDigits: 0,
              type: 'string'
            },
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30
          });
        });
      });

      describe('when no divisions are found for customer', () => {
        beforeEach(async () => {
          expectedResponse = { businessUnits: [] };
          res = await service.findBusinessUnits('not-found');
        });

        it('should call CustomersRepository.find', () => {
          expect(mockBusinessUnitsRepository.find).toHaveBeenCalledWith({
            queryArgs: { where: [`associates(customer(id="not-found"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
          });
        });

        it('should return a 404 Error', () => {
          expect(res).toEqual(expectedResponse);
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = new CommercetoolsError(mockCommercetoolsErrorMalformed);
        try {
          await service.findBusinessUnits('error');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CustomersRepository.find', () => {
        expect(mockBusinessUnitsRepository.find).toHaveBeenCalledWith({
          queryArgs: { where: [`associates(customer(id="error"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('findByRut', () => {
    let response: BusinessUnit[] | CommercetoolsError;

    describe('when success', () => {
      describe('when customer business units are found', () => {
        beforeEach(async () => {
          response = await service.findByRut('rut');
        });

        it('should call BusinessUnitsRepository.find for rut', () => {
          expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: { where: [`custom(fields(rut="rut"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
          });
        });

        it('should return BusinessUnit[]', () => {
          expect(response).toEqual([mockDivisionBusinessUnit]);
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = new CommercetoolsError(mockCommercetoolsErrorMalformed);
        try {
          await service.findByRut('error');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call BusinessUnitsRepository.find', () => {
        expect(mockBusinessUnitsRepository.find).toHaveBeenCalledWith({
          queryArgs: { where: [`custom(fields(rut="error"))`], expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('getById', () => {
    let response: BusinessUnit | CommercetoolsError;

    describe('when success', () => {
      describe('when customer business units are found', () => {
        beforeEach(async () => {
          response = await service.getById('bu-id');
        });

        it('should call BusinessUnitsRepository.getById', () => {
          expect(mockBusinessUnitsRepository.getById).toHaveBeenCalledWith('bu-id', {
            queryArgs: {
              expand: ['associates[*].customer', 'custom.fields.deliveryZone']
            }
          });
        });

        it('should return Business Unit', () => {
          expect(response).toEqual(mockCompanyBusinessUnit);
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = new CommercetoolsError(mockCommercetoolsErrorNotFound);
        try {
          await service.getById('error');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call BusinessUnitsRepository.getById', () => {
        expect(mockBusinessUnitsRepository.getById).toHaveBeenCalledWith('error', {
          queryArgs: {
            expand: ['associates[*].customer', 'custom.fields.deliveryZone']
          }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('getConvertedById', () => {
    let response: ConvertedBusinessUnit | CommercetoolsError;

    describe('when success', () => {
      describe('when customer business units are found', () => {
        beforeEach(async () => {
          response = await service.getConvertedById('bu-id');
        });

        it('should call BusinessUnitsRepository.getById', () => {
          expect(mockBusinessUnitsRepository.getById).toHaveBeenCalledWith('bu-id', { queryArgs: { expand: ['associates[*].customer', 'custom.fields.deliveryZone'] } });
        });

        it('should return Business Unit', () => {
          expect(response).toEqual({
            ...mockCompanyBusinessUnit,
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
            rut: '123456789',
            taxProfile: '1',
            shouldApplyT2Rate: true,
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30,
            tradeName: undefined,
            t2Rate: '0.12',
            distributionCenter: 'COMPANY_DC',
            externalId: 'sap_buid',
            customerGroupCode: 'TRADICIONAL'
          });
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = new CommercetoolsError(mockCommercetoolsErrorNotFound);
        try {
          await service.getConvertedById('error');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call BusinessUnitsRepository.getById', () => {
        expect(mockBusinessUnitsRepository.getById).toHaveBeenCalledWith('error', { queryArgs: { expand: ['associates[*].customer', 'custom.fields.deliveryZone'] } });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('updateById', () => {
    let response: BusinessUnit | CommercetoolsError;

    describe('when success', () => {
      describe('when customer business units are updated', () => {
        beforeEach(async () => {
          response = await service.updateById('bu-id', {
            version: 1,
            actions: []
          });
        });

        it('should call BusinessUnitsRepository.updateById', () => {
          expect(mockBusinessUnitsRepository.updateById).toHaveBeenCalledWith('bu-id', {
            body: {
              version: 1,
              actions: []
            },
            queryArgs: {
              expand: ['associates[*].customer', 'custom.fields.deliveryZone']
            }
          });
        });

        it('should return Business Unit', () => {
          expect(response).toEqual(mockCompanyBusinessUnit);
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = new CommercetoolsError(mockCommercetoolsErrorNotFound);
        try {
          await service.updateById('error', {
            version: 1,
            actions: []
          });
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call BusinessUnitsRepository.updateById', () => {
        expect(mockBusinessUnitsRepository.updateById).toHaveBeenCalledWith('error', {
          body: {
            version: 1,
            actions: []
          },
          queryArgs: {
            expand: ['associates[*].customer', 'custom.fields.deliveryZone']
          }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('update', () => {
    let response: ConvertedBusinessUnit | Error;
    let spy: jest.SpyInstance;

    afterAll(() => {
      spy.mockClear();
      spy.mockRestore();
    });

    describe('when success', () => {
      describe('when customer business units are updated', () => {
        const buId = 'update-id';
        const request = {
          address: {
            country: 'CL',
            city: 'locality',
            commune: 'commune',
            region: 'Region',
            streetName: 'streetName',
            streetNumber: 'streetNumber'
          }
        };
        const email = 'user@user.com';
        const actions = [
          {
            action: 'addAddress',
            address: {
              key: 'key',
              country: request.address.country,
              city: request.address.city,
              streetName: request.address.streetName,
              streetNumber: request.address.streetNumber
            }
          }
        ] as BusinessUnitAddAddressAction[];

        beforeEach(async () => {
          spy = jest.spyOn(service, 'createBusinessUnitUpdateActions').mockImplementation(() => Promise.resolve(actions));
          response = await service.update(buId, request, email);
        });

        it('should call BusinessUnitsRepository.getById', () => {
          expect(mockBusinessUnitsRepository.getById).toHaveBeenCalledWith(buId, {
            queryArgs: {
              expand: ['associates[*].customer', 'custom.fields.deliveryZone']
            }
          });
        });

        it('should call BusinessUnitsRepository.updateById', () => {
          expect(mockBusinessUnitsRepository.updateById).toHaveBeenCalledWith(buId, {
            body: {
              version: 2,
              actions
            },
            queryArgs: {
              expand: ['associates[*].customer', 'custom.fields.deliveryZone']
            }
          });
        });

        it('should return Business Unit', () => {
          expect(response).toEqual({
            ...mockCompanyBusinessUnit,
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
            rut: '123456789',
            taxProfile: '1',
            shouldApplyT2Rate: true,
            externalId: 'sap_buid',
            distributionCenter: 'COMPANY_DC',
            customerGroupCode: 'TRADICIONAL',
            t2Rate: '0.12',
            tradeName: undefined,
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30
          });
        });
      });
    });

    describe('when failure', () => {
      describe('when the customer is not associated to this Business Unit', () => {
        const buId = 'failure-id';
        const request = {
          address: {
            country: 'CL',
            city: 'locality',
            streetName: 'streetName',
            streetNumber: 'streetNumber',
            commune: 'commune',
            region: 'region'
          }
        };
        const email = 'user@user.com';

        beforeEach(async () => {
          spy = jest.spyOn(service, 'createBusinessUnitUpdateActions').mockImplementation();
          try {
            await service.update(buId, request, email);
          } catch (error) {
            response = error;
          }
        });

        it('should call BusinessUnitsRepository.getById', () => {
          expect(mockBusinessUnitsRepository.getById).toHaveBeenCalledWith(buId, {
            queryArgs: {
              expand: ['associates[*].customer', 'custom.fields.deliveryZone']
            }
          });
        });

        it('should not call BusinessUnitsRepository.updateById', () => {
          expect(mockBusinessUnitsRepository.updateById).not.toHaveBeenCalled();
        });

        it('should not call createBusinessUnitUpdateActions', () => {
          expect(spy).not.toHaveBeenCalled();
        });

        it('should return an error response for buNotAssociateCustomer', () => {
          expect(response).toEqual(Error('Customer not associated to Business Unit or lacks access'));
        });
      });
    });
  });

  describe('createBusinessUnitUpdateActions', () => {
    let response: BusinessUnitUpdateAction[] | Error;

    describe('when success', () => {
      describe('should create all actions', () => {
        beforeEach(async () => {
          response = await service.createBusinessUnitUpdateActions(requestBusinessUnitMock, mockCompanyBusinessUnit as BusinessUnit);
        });

        it('should return Business Unit Actions', () => {
          expect(response).toEqual(responseBusinessUnitActions);
        });
      });

      describe('should create all actions and activate the business unit', () => {
        beforeEach(async () => {
          response = await service.createBusinessUnitUpdateActions(requestBusinessUnitMock, { ...mockCompanyBusinessUnit, status: 'Inactive' } as BusinessUnit);
        });

        it('should return Business Unit Actions', () => {
          expect(response).toEqual([...responseBusinessUnitActions, { action: 'changeStatus', status: 'Active' }]);
        });
      });

      describe('should create all actions and check if exist prev address', () => {
        beforeEach(async () => {
          response = await service.createBusinessUnitUpdateActions(requestBusinessUnitMock, {
            ...mockCompanyBusinessUnit,
            addresses: [{ key: 'shipping-address' }]
          } as BusinessUnit);
        });

        it('should return Business Unit Actions', () => {
          expect(response).toEqual(
            responseBusinessUnitActions.map(resp => {
              if (resp.address?.key === 'shipping-address') return { ...resp, addressKey: 'shipping-address', action: 'changeAddress' };
              return resp;
            })
          );
        });
      });

      describe('should create actions with the minimum', () => {
        beforeEach(async () => {
          response = await service.createBusinessUnitUpdateActions(
            {
              address: {
                country: 'CL',
                city: 'locality',
                streetName: 'streetName',
                streetNumber: 'streetNumber',
                commune: 'commune',
                region: 'region'
              }
            },
            mockCompanyBusinessUnit as BusinessUnit
          );
        });

        it('should return Business Unit Actions', () => {
          expect(response).toEqual(responseMinimumBusinessUnitActions);
        });
      });
    });

    describe('when failure', () => {
      describe('should throw locality not have a delivery zone', () => {
        const request = {
          ...requestBusinessUnitMock,
          address: {
            ...requestBusinessUnitMock.address,
            city: 'no-locality'
          }
        };
        beforeEach(async () => {
          try {
            await service.createBusinessUnitUpdateActions(request, mockCompanyBusinessUnit as BusinessUnit);
          } catch (error) {
            response = error;
          }
        });

        it('should throw an Error response', () => {
          expect(response).toEqual(new NotFoundException());
        });
      });
    });
  });

  describe('createBusinessUnit', () => {
    let response: CommercetoolsError | ConvertedBusinessUnit;

    describe('when success', () => {
      describe('when create customer successfully', () => {
        beforeEach(async () => {
          response = await service.createBusinessUnit({
            unitType: 'Company',
            key: 'key',
            name: 'name'
          });
        });

        it('should call BusinessUnitsRepository.create', () => {
          expect(mockBusinessUnitsRepository.create).toHaveBeenCalledWith({
            body: {
              unitType: 'Company',
              key: 'key',
              name: 'name'
            },
            queryArgs: {
              expand: ['associates[*].customer', 'custom.fields.deliveryZone']
            }
          });
        });

        it('should return BusinessUnit', () => {
          expect(response).toEqual({
            ...mockCompanyBusinessUnit,
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
            rut: '123456789',
            taxProfile: '1',
            shouldApplyT2Rate: true,
            externalId: 'sap_buid',
            distributionCenter: 'COMPANY_DC',
            customerGroupCode: 'TRADICIONAL',
            t2Rate: '0.12',
            tradeName: undefined,
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30
          });
        });
      });
      describe('when pass the origin', () => {
        beforeEach(async () => {
          response = await service.createBusinessUnit(
            {
              unitType: 'Company',
              key: 'key',
              name: 'name'
            },
            'some-origen'
          );
        });

        it('should call BusinessUnitsRepository.create', () => {
          expect(mockBusinessUnitsRepository.create).toHaveBeenCalledWith({
            body: {
              unitType: 'Company',
              key: 'key',
              name: 'name'
            },
            queryArgs: {
              expand: ['associates[*].customer', 'custom.fields.deliveryZone']
            },
            headers: {
              'X-External-User-ID': 'some-origen'
            }
          });
        });

        it('should return BusinessUnit', () => {
          expect(response).toEqual({
            ...mockCompanyBusinessUnit,
            custom: undefined,
            deliveryZoneKey: 'company-city',
            distributionChannelId: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
            rut: '123456789',
            taxProfile: '1',
            shouldApplyT2Rate: true,
            externalId: 'sap_buid',
            distributionCenter: 'COMPANY_DC',
            customerGroupCode: 'TRADICIONAL',
            t2Rate: '0.12',
            tradeName: undefined,
            isCreditEnabled: true,
            isCreditBlocked: true,
            creditLimit: 1000,
            creditExcessTolerance: 500,
            creditTermDays: 30
          });
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      beforeEach(async () => {
        try {
          await service.createBusinessUnit({
            unitType: 'Company',
            key: 'invalid',
            name: 'name'
          });
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call BusinessUnitsRepository.create', () => {
        expect(mockBusinessUnitsRepository.create).toHaveBeenCalledWith({
          body: {
            unitType: 'Company',
            key: 'invalid',
            name: 'name'
          },
          queryArgs: {
            expand: ['associates[*].customer', 'custom.fields.deliveryZone']
          }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(new CommercetoolsError(mockCommercetoolsErrorMalformed));
      });
    });
  });

  describe('findByRut', () => {
    let response: ConvertedBusinessUnit[];
    let spy: jest.SpyInstance;
    let spyConverted: jest.SpyInstance;

    afterEach(() => {
      spy.mockClear();
      spyConverted.mockClear();
      spy.mockRestore();
      spyConverted.mockRestore();
    });

    beforeEach(() => {
      spy = jest.spyOn(service, 'findByRut').mockImplementation(rut => {
        if (['new-rut', 'username', 'username-register', 'new-ru-T'].includes(rut)) {
          return Promise.resolve([]);
        }

        return Promise.resolve([mockDivisionBusinessUnit]);
      });

      spyConverted = jest.spyOn(service, 'convertBusinessUnit').mockImplementation(() =>
        Promise.resolve({
          ...mockDivisionBusinessUnit,
          distributionChannelId: 'distributionChannelId',
          deliveryZoneKey: mockDivisionBusinessUnit.custom?.fields.deliveryZone?.obj?.key,
          rut: mockDivisionBusinessUnit.custom?.fields.rut,
          custom: undefined,
          taxProfile: mockDivisionBusinessUnit.custom?.fields.taxProfile,
          shouldApplyT2Rate: mockDivisionBusinessUnit.custom?.fields.shouldApplyT2Rate,
          externalId: mockDivisionBusinessUnit.custom?.fields.externalId
        })
      );
    });

    describe('when rut exists', () => {
      beforeEach(async () => {
        response = await service.findConvertedByRut('rut');
      });

      test('should call to the findByRut bu service method', () => {
        expect(spy).toHaveBeenCalledWith('ru-T');
      });

      test('should call to the convertBusinessUnit bu service method', () => {
        expect(spyConverted).toHaveBeenCalledWith({
          ...mockDivisionBusinessUnit,
          minimumOrderAmount: {
            centAmount: 5000,
            currencyCode: 'CLP',
            fractionDigits: 0,
            type: 'string'
          }
        });
      });

      test('should return the converted response', () => {
        expect(response).toEqual([
          {
            addresses: [],
            associates: [
              {
                associateRoleAssignments: [{ associateRole: { key: 'buyer-role', typeId: 'associate-role' }, inheritance: 'Disabled' }],
                customer: { id: 'anotherCustomerId', typeId: 'customer' },
                roles: ['Buyer']
              }
            ],
            billingAddressIds: [],
            custom: undefined,
            deliveryZoneKey: undefined,
            distributionChannelId: 'distributionChannelId',
            externalId: undefined,
            id: 'div-id',
            key: 'div-key',
            name: 'Division Name',
            parentUnit: { key: 'key', typeId: 'business-unit' },
            rut: 'rut',
            shippingAddressIds: [],
            shouldApplyT2Rate: undefined,
            status: 'Active',
            storeMode: 'Explicit',
            stores: [],
            taxProfile: undefined,
            topLevelUnit: { key: 'key', typeId: 'business-unit' },
            unitType: 'Division',
            version: 2
          }
        ]);
      });
    });

    describe('when rut does not exist', () => {
      beforeEach(async () => {
        response = await service.findConvertedByRut('new-rut');
      });

      test('should call to the findByRut bu service method', () => {
        expect(spy).toHaveBeenCalledWith('new-ru-T');
      });

      test('should not call to the convertBusinessUnit bu service method', () => {
        expect(spyConverted).not.toHaveBeenCalled();
      });

      test('should return empty array', () => {
        expect(response).toEqual([]);
      });
    });
  });

  describe('getConvertedByKey', () => {
    let response;

    describe('when key exists', () => {
      beforeEach(async () => {
        response = await service.getConvertedByKey('key');
      });

      test('should call business units repository get by key', () => {
        expect(mockBusinessUnitsRepository.getByKey).toHaveBeenCalledWith('key', { queryArgs: { expand: ['associates[*].customer', 'custom.fields.deliveryZone'] } });
      });

      it('should return Business Unit', () => {
        expect(response).toEqual({
          ...mockCompanyBusinessUnit,
          custom: undefined,
          deliveryZoneKey: 'company-city',
          distributionChannelId: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
          externalId: 'sap_buid',
          rut: '123456789',
          taxProfile: '1',
          shouldApplyT2Rate: true,
          distributionCenter: 'COMPANY_DC',
          customerGroupCode: 'TRADICIONAL',
          t2Rate: '0.12',
          isCreditEnabled: true,
          isCreditBlocked: true,
          creditLimit: 1000,
          creditExcessTolerance: 500,
          creditTermDays: 30,
          tradeName: undefined
        });
      });
    });
  });

  describe('createDivision', () => {
    describe('when parent business unit does not exist', () => {
      beforeEach(() => {
        mockBusinessUnitsRepository.getById.mockResolvedValueOnce(null);
      });

      it('should throw NotFoundException', async () => {
        await expect(service.createDivision('parentId', {} as CreateDivisionRequestDto, {} as TDivisionHeaders)).rejects.toThrow(
          new NotFoundException('Business Unit does not exist')
        );
      });
    });

    describe('when parent business unit exists', () => {
      describe('when user has CSR_ROLE', () => {
        const headersMock: TDivisionHeaders = { userRoles: [CSR_ROLE], username: '' };
        let result;
        beforeEach(async () => {
          mockCustomersService.getCustomerByEmail.mockRejectedValueOnce('not-found');
          result = await service.createDivision(
            'parentId',
            { address: { city: 'locality' }, contactInfo: { firstName: 'firstName', lastName: 'lastName', email: 'email@email.com', phone: 'phone' } } as CreateDivisionRequestDto,
            headersMock
          );
        });

        beforeEach(() => {
          jest.spyOn(service, 'createBusinessUnit').mockResolvedValueOnce({ id: 'division-id', deliveryZoneKey: 'key' });
        });

        it('should warn Customer does not exist', () => {
          expect(logger.warn).toHaveBeenCalledWith(`Customer email@email.com does not exist`);
        });

        it('should create a division', async () => {
          expect(result).toEqual({ id: 'division-id', deliveryZoneKey: 'key' });
        });
      });
      describe('when user has INTERNAL_ROLE', () => {
        const headersMock: TDivisionHeaders = { userRoles: [INTERNAL_ROLE], username: '' };

        beforeEach(() => {
          jest.spyOn(service, 'createBusinessUnit').mockResolvedValueOnce({ id: 'division-id', deliveryZoneKey: 'key' });
        });

        it('should create a division', async () => {
          const result = await service.createDivision(
            'parentId',
            { address: { city: 'locality' }, contactInfo: { firstName: 'firstName', lastName: 'lastName', email: 'email@email.com', phone: 'phone' } } as CreateDivisionRequestDto,
            headersMock
          );
          expect(result).toEqual({ id: 'division-id', deliveryZoneKey: 'key' });
        });
      });

      describe('when user does not have CSR_ROLE but is an administrator', () => {
        const headersMock: TDivisionHeaders = { userRoles: ['OTHER'], username: 'user@mail.com' };

        beforeEach(() => {
          jest.spyOn(service, 'createBusinessUnit').mockResolvedValueOnce({ id: 'division-id', deliveryZoneKey: 'key' });
          mockBusinessUnitsRepository.getById.mockResolvedValueOnce({
            ...mockCompanyBusinessUnit,
            associates: [
              {
                customer: { obj: { email: 'user@mail.com' } },
                associateRoleAssignments: [
                  {
                    associateRole: {
                      key: BU_ADMIN_ROLE
                    }
                  }
                ]
              }
            ]
          });
        });

        it('should create a division', async () => {
          const result = await service.createDivision(
            'parentId',
            { address: { city: 'locality' }, contactInfo: { firstName: 'firstName', lastName: 'lastName', email: 'email@email.com', phone: 'phone' } } as CreateDivisionRequestDto,
            headersMock
          );
          expect(result).toEqual({ id: 'division-id', deliveryZoneKey: 'key' });
        });
      });

      describe('when user does not have CSR_ROLE and is not an administrator', () => {
        const headersMock: TDivisionHeaders = { username: 'user@mail.com', userRoles: [] };

        beforeEach(() => {
          jest.spyOn(service, 'createBusinessUnit').mockResolvedValueOnce({ id: 'division-id', deliveryZoneKey: 'key' });
          mockBusinessUnitsRepository.getById.mockResolvedValueOnce({
            associates: [
              {
                customer: {
                  obj: {
                    email: 'user@mail.com'
                  }
                },
                associateRoleAssignments: [
                  {
                    associateRole: {
                      key: 'some-other-role'
                    }
                  }
                ]
              }
            ]
          });
        });

        it('should throw an error', async () => {
          await expect(service.createDivision('parentId', {} as CreateDivisionRequestDto, headersMock)).rejects.toThrow(ErrorBuilder.buildError('buNotAssociateCustomer'));
        });
      });

      describe('when getDeliveryZonesByLocality throw an error', () => {
        const headersMock: TDivisionHeaders = { userRoles: [CSR_ROLE], username: 'user@mail.com' };

        it('show throw the error noDeliveryZoneAssociated', async () => {
          mockDeliveryZonesService.getDeliveryZonesByLocality.mockRejectedValueOnce('error');
          try {
            await service.createDivision(
              'parentId',
              {
                address: { city: 'locality' },
                contactInfo: { firstName: 'firstName', lastName: 'lastName', email: 'email@email.com', phone: 'phone' }
              } as CreateDivisionRequestDto,
              headersMock
            );
          } catch (error) {
            expect(error).toStrictEqual(ErrorBuilder.buildError('noDeliveryZoneAssociated'));
          }
        });
      });

      describe('when the customer already exists and does not associated to the bu or division', () => {
        const headersMock: TDivisionHeaders = { userRoles: [CSR_ROLE], username: 'user@mail.com' };
        let spyOnfindDivisions: jest.SpyInstance<any>;

        it('should throw customerAlreadyRegistered error', async () => {
          spyOnfindDivisions = jest.spyOn(service as any, 'findDivisions').mockResolvedValueOnce([]);
          mockCustomersService.getCustomerByEmail.mockResolvedValueOnce({ ...mockCommercetoolsCustomerResponse.results[0], email: 'no-match-email@email.com' });
          try {
            await service.createDivision(
              'parentId',
              {
                address: { city: 'locality' },
                contactInfo: { firstName: 'firstName', lastName: 'lastName', email: 'email@email.com', phone: 'phone' }
              } as CreateDivisionRequestDto,
              headersMock
            );
          } catch (error) {
            expect(error).toStrictEqual(ErrorBuilder.buildError('customerAlreadyRegistered'));
          }
        });

        afterAll(() => {
          spyOnfindDivisions.mockRestore();
        });
      });
    });
  });

  describe('deleteById', () => {
    let response: BusinessUnit;

    describe('when success', () => {
      describe('when customer business units are found', () => {
        beforeEach(async () => {
          response = await service.deleteById('id', 1);
        });

        it('should call BusinessUnitsRepository.deleteById', () => {
          expect(mockBusinessUnitsRepository.deleteById).toHaveBeenCalledWith('id', {
            queryArgs: {
              version: 1
            }
          });
        });

        it('should return Business Unit', () => {
          expect(response).toEqual(mockCompanyBusinessUnit);
        });
      });
    });
  });

  describe('getAllBusinessUnit', () => {
    it('get all Business Unit - success', async () => {
      mockBusinessUnitsRepository.find = jest.fn().mockResolvedValue({
        total: 1,
        results: [mocktFindBusinessUnit]
      });
      expect(await service.getAllBusinessUnits(filterGetAllBusinessUnitsMock)).toEqual(mockBusinessUnitList);
    });

    it('get all Business Unit EBusinessUnitsSortField = rut and custom null - success', async () => {
      filterGetAllBusinessUnitsMock.sortField = EBusinessUnitsSortField.rut;
      mockBusinessUnitsRepository.find = jest.fn().mockResolvedValue({
        total: 1,
        results: [mocktFindBusinessUnitCustomNull]
      });
      expect(await service.getAllBusinessUnits(filterGetAllBusinessUnitsMock)).toEqual([
        {
          id: 'test2',
          name: 'test2',
          rut: '',
          addresses: [],
          email: ''
        }
      ]);
    });
  });

  describe('getDistributionChannelId', () => {
    let serviceSpy = jest.spyOn(BusinessUnitsService.prototype as any, 'getCorrespondingDistributionChannel');

    describe('when success', () => {
      describe('when business unit is a company', () => {
        beforeEach(async () => {
          serviceSpy = jest.spyOn(BusinessUnitsService.prototype as any, 'getCorrespondingDistributionChannel');
          await service.convertBusinessUnit(mockCompanyBusinessUnit as BusinessUnit);
        });

        it('should not call getByKey for the parent', () => {
          expect(mockBusinessUnitsRepository.getByKey).not.toHaveBeenCalledWith('company-sap-id', {
            queryArgs: { expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
          });
        });

        it('should call getCorrespondingDistributionChannel', () => {
          expect(serviceSpy).toHaveBeenCalledWith({
            businessUnitId: 'sap_buid',
            customerGroup: 'TRADICIONAL',
            distributionCenterCode: 'COMPANY_DC',
            salesSubchannel: undefined
          });
        });
      });

      describe('when business unit is a division', () => {
        beforeEach(async () => {
          await service.convertBusinessUnit({
            ...mockDivisionBusinessUnit,
            topLevelUnit: {
              typeId: 'business-unit',
              key: 'company-sap-key'
            },
            custom: {
              ...mockDivisionBusinessUnit.custom,
              fields: {
                deliveryZone: {
                  obj: {
                    value: { dcCode: 'DIVISION_DC' }
                  }
                },
                customerGroupCode: 'TRADICIONAL',
                externalId: 'division-sap-id'
              }
            }
          } as BusinessUnit);
        });

        it('should call getByKey for the parent', () => {
          expect(mockBusinessUnitsRepository.getByKey).toHaveBeenCalledWith('company-sap-key', { queryArgs: { expand: ['associates[*].customer', 'custom.fields.deliveryZone'] } });
        });

        it('should call getCorrespondingDistributionChannel with comapany SAP id', () => {
          expect(serviceSpy).toHaveBeenCalledWith({
            businessUnitId: 'company-sap-id',
            customerGroup: 'TRADICIONAL',
            distributionCenterCode: 'DIVISION_DC',
            salesSubchannel: undefined
          });
        });
      });
    });
  });
});

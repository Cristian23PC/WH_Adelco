const mockCustomObjectRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs) {
      if (queryArgs?.where?.some(condition => condition.match('custom-object.regionsContainer'))) return Promise.resolve(regionsPagedQueryResponseMock);

      if (queryArgs?.where?.some(condition => condition.match('de-aisen-del-gral-c-ibanez-del-campo')))
        return Promise.resolve({
          ...regionsPagedQueryResponseMock,
          results: regionsPagedQueryResponseMock.results.map(result => ({ ...result, value: { ...result.value, region: 'de-aisen-del-gral-c-ibanez-del-campo' } }))
        });

      if (queryArgs?.where?.some(condition => condition.match('custom-object-delivery-zone.deliveryZoneContainer')))
        return Promise.resolve({
          limit: 500,
          offset: 0,
          count: 0,
          total: 0,
          results: [mockDeliveryZone]
        });

      if (queryArgs?.where?.some(condition => condition.match('bad-region'))) return Promise.resolve({ limit: 500, offset: 0, count: 0, total: 0, results: [] });
    }
    return Promise.resolve(mockRegionsResponse);
  }),
  getByContainerAndKey: jest.fn((container, communeKey) => {
    if (container === 'custom-object-commune.communesContainer' && communeKey === 'aisen')
      return Promise.resolve({
        key: 'aisen',
        value: { label: 'Aisén', region: 'de-aisen-del-gral-c-ibanez-del-campo' }
      });

    if (communeKey === 'bad-commune') throw new NotFoundException('Not Found');
    return Promise.resolve(undefined);
  })
};

const mockChannelsRepository = {
  find: jest.fn(() => {
    return Promise.resolve({
      results: []
    });
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CustomObjectsRepository: jest.fn().mockImplementation(() => mockCustomObjectRepository),
  ChannelsRepository: jest.fn().mockImplementation(() => mockChannelsRepository)
}));

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { BusinessUnitsRegionsController } from '../business-units-regions.controller';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { CommercetoolsExceptionFilter } from '@/common/filters/commercetools.exception.filter';
import { ApiErrorFilter } from '@/common/filters/api.exception.filter';
import { TrimStringsPipe } from '@/common/transformer/trim-strings.pipe';
import { RegionsService } from '@/regions/regions.service';
import { mockRegionsResponse, regionsPagedQueryResponseMock } from '@/regions/__mocks__/regions.mock';
import { ConfigService } from '@nestjs/config';
import { ChannelsRepository, CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { CommunesService } from '@/communes/communes.service';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { mockDeliveryZone } from '../__mocks__';
import { CommonModule } from '@/common/common.module';

describe('Regions', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), CommonModule],
      controllers: [BusinessUnitsRegionsController],
      providers: [
        RegionsService,
        CommunesService,
        DeliveryZonesService,
        CustomObjectsRepository,
        ChannelsRepository,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => key)
          }
        }
      ]
    }).compile();
    app = module.createNestApplication();

    app
      .useGlobalFilters(new AllExceptionsFilter())
      .useGlobalFilters(new CommercetoolsExceptionFilter())
      .useGlobalFilters(new ApiErrorFilter())
      .useGlobalPipes(new TrimStringsPipe(), new ValidationPipe());

    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('GET /regions', () => {
    const url = '/regions';

    it('should return a full list of regions', () => {
      return request(app.getHttpServer())
        .get(url)
        .expect(200)
        .expect(mockRegionsResponse.map(({ value, key }) => ({ key, label: value.label })));
    });
  });

  describe('GET /regions/:regionKey/communes', () => {
    const url = '/regions/:regionKey/communes';

    it('should return a full list of regions by regionKey', () => {
      return request(app.getHttpServer())
        .get(url.replace(':regionKey', 'de-aisen-del-gral-c-ibanez-del-campo'))
        .expect(200)
        .expect(mockRegionsResponse.map(({ value, key }) => ({ key, label: value.label, region: 'de-aisen-del-gral-c-ibanez-del-campo' })));
    });

    it('should return a empty list if region does not exist', () => {
      return request(app.getHttpServer()).get(url.replace(':regionKey', 'bad-region')).expect(200).expect([]);
    });
  });

  describe('GET /regions/:regionKey/communes/:communeKey/delivery-zones', () => {
    const url = '/regions/:regionKey/communes/:communeKey/delivery-zones';
    const regionKey = 'de-aisen-del-gral-c-ibanez-del-campo';

    it('should return a full list of delivery Zones from Commune', () => {
      return request(app.getHttpServer())
        .get(url.replace(':regionKey', regionKey).replace(':communeKey', 'aisen'))
        .expect(200)
        .expect([
          {
            key: mockDeliveryZone.key,
            ...mockDeliveryZone.value
          }
        ]);
    });

    it('should return a empty list if region does not exist', () => {
      return request(app.getHttpServer()).get(url.replace(':regionKey', 'bad-region').replace(':communeKey', 'aisen')).expect(200).expect([]);
    });

    it('should throw a not found error if commune does not exist', () => {
      return request(app.getHttpServer())
        .get(url.replace(':regionKey', regionKey).replace(':communeKey', 'bad-commune'))
        .expect(404)
        .expect({ statusCode: 404, message: 'Not Found' });
    });

    it('should throw a not found error if commune and region does not exist', () => {
      return request(app.getHttpServer())
        .get(url.replace(':regionKey', 'bad-region').replace(':communeKey', 'bad-commune'))
        .expect(404)
        .expect({ statusCode: 404, message: 'Not Found' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

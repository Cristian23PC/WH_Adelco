const mockedLiveResponse = {
  status: 'ok',
  info: {},
  error: {},
  details: {}
} as HealthCheckResult;

const mockedHealthIndicatorResponse = {
  commercetools: {
    status: 'up'
  }
} as HealthIndicatorResult;

const mockedReadyResponse = {
  status: 'ok',
  info: mockedHealthIndicatorResponse,
  error: {},
  details: mockedHealthIndicatorResponse
} as HealthCheckResult;

const mockHealthCheckService = {
  check: jest.fn((healthIndicators: HealthIndicatorFunction[]) => {
    if (healthIndicators.length === 0) {
      return Promise.resolve(mockedLiveResponse);
    }
    return Promise.resolve(mockedReadyResponse);
  })
};

const mockHealthIndicator = {
  pingCheck: jest.fn(() => Promise.resolve(mockedHealthIndicatorResponse))
};

jest.mock('@nestjs/terminus', () => ({
  HealthCheckService: jest.fn().mockImplementation(() => mockHealthCheckService),
  HttpHealthIndicator: jest.fn().mockImplementation(() => mockHealthIndicator)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator, HealthCheckResult, HealthIndicatorResult, HealthIndicatorFunction } from '@nestjs/terminus';

describe('AppService', () => {
  let response: HealthCheckResult | Error;
  let service: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, ConfigService, HealthCheckService, HttpHealthIndicator]
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('ready', () => {
    beforeEach(async () => {
      response = await service.ready();
    });

    it('shoul call check', () => {
      expect(mockHealthCheckService.check).toHaveBeenCalled();
    });

    it('should return a response object with status 200 and boolean value true', () => {
      expect(response).toEqual(mockedReadyResponse);
    });
  });

  describe('live', () => {
    beforeEach(async () => {
      response = await service.live();
    });

    it('shoul call check', () => {
      expect(mockHealthCheckService.check).toHaveBeenCalledWith([]);
    });

    it('should return a response object with status 200 and boolean value true', () => {
      expect(response).toEqual(mockedLiveResponse);
    });
  });
});

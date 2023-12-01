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

const mockedAppService = {
  live: jest.fn(() => Promise.resolve(mockedLiveResponse)),
  ready: jest.fn(() => Promise.resolve(mockedReadyResponse))
};

jest.mock('../app.service', () => ({
  AppService: jest.fn().mockImplementation(() => mockedAppService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ConfigModule]
    }).compile();
  });

  describe('health', () => {
    let controller;
    let response: HealthCheckResult;

    beforeAll(() => {
      controller = app.get<AppController>(AppController);
    });

    describe('live', () => {
      beforeEach(async () => {
        response = await controller.live();
      });
      it('should return healthcheck', () => {
        expect(response).toEqual(mockedLiveResponse);
      });
    });

    describe('ready', () => {
      beforeEach(async () => {
        response = await controller.ready();
      });
      describe('live', () => {
        it('should return healthcheck', () => {
          expect(response).toEqual(mockedReadyResponse);
        });
      });
    });
  });
});

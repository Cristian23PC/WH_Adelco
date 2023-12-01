const mockPublishMessage = jest.fn((message: NotificationMessage) => (message.type ? Promise.resolve() : Promise.reject('error')));

jest.mock('@google-cloud/pubsub', () => ({ PubSub: jest.fn().mockImplementation(() => ({ topic: () => ({ publishMessage: mockPublishMessage }) })) }));

const mockLoggerService = {
  error: jest.fn()
};

jest.mock('@/common/utils/logger/logger.service', () => ({ LoggerService: jest.fn().mockImplementation(() => mockLoggerService) }));

const mockConfigService = {
  get: jest.fn(() => 'notification-topic')
};

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationMessage, NotificationsService } from '../index';
import { ConfigService } from '@nestjs/config';
import { MessageOptions } from '@google-cloud/pubsub/build/src/topic';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, { provide: ConfigService, useValue: mockConfigService }]
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('sendNotification', () => {
    let data: NotificationMessage, message: MessageOptions;
    describe('when notification is sent successfully', () => {
      it('should call pubsubService topic publishMessage', async () => {
        data = {
          type: 'TYPE',
          deliveryId: 'deliveryId'
        };

        message = {
          data: Buffer.from(JSON.stringify(data))
        };

        await service.sendNotification(data, 'mongoDeliveriesSync');

        expect(mockPublishMessage).toHaveBeenCalledWith(message);
      });
    });

    describe('when something fails', () => {
      it('should call loggerService error', async () => {
        data = {
          type: undefined,
          deliveryId: 'deliveryId'
        };

        await service.sendNotification(data, 'mongoDeliveriesSync');

        expect(mockLoggerService.error).toHaveBeenNthCalledWith(1, "Problems sending notification to topic [', notification-topic, ']");
        expect(mockLoggerService.error).toHaveBeenNthCalledWith(2, 'error');
      });
    });
  });
});

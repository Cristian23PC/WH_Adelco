const mockPublishMessage = jest.fn((message: NotificationMessage) => (message.notificationType ? Promise.resolve() : Promise.reject('error')));

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
          to: [{ email: 'email1@mail.com', name: 'email 1' }],
          notificationType: 'MAIL_VERIFICATION_CODE',
          templateData: { code: 1234 }
        };

        message = {
          data: Buffer.from(JSON.stringify(data))
        };

        await service.sendNotification(data);

        expect(mockPublishMessage).toHaveBeenCalledWith(message);
      });
    });

    describe('when something fails', () => {
      it('should call loggerService error', async () => {
        data = {
          to: [{ email: 'email1@mail.com', name: 'email 1' }],
          notificationType: undefined,
          templateData: { code: 1234 }
        };

        await service.sendNotification(data);

        expect(mockLoggerService.error).toHaveBeenNthCalledWith(1, "Problems sending notification to topic [', notification-topic, ']");
        expect(mockLoggerService.error).toHaveBeenNthCalledWith(2, 'error');
      });
    });
  });
});

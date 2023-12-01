import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { NotificationMessage } from './notifications.interfaces';
import { LoggerService } from '@/common/utils/logger/logger.service';
import loggerConfig from '@/config/logger.config';

@Injectable()
export class NotificationsService {
  private pubsubService: PubSub;
  private loggerService: LoggerService;

  constructor() {
    this.pubsubService = new PubSub();
    this.loggerService = new LoggerService(loggerConfig());
  }

  async sendNotification(data: NotificationMessage, topicName: string): Promise<void> {
    const message = {
      data: Buffer.from(JSON.stringify(data))
    };

    try {
      await this.pubsubService.topic(topicName).publishMessage(message);
    } catch (err) {
      this.loggerService.error(`Problems sending notification to topic [', ${topicName}, ']`);
      this.loggerService.error(err);
    }
  }
}

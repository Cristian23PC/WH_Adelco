import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationMessage } from './notifications.interfaces';
import { LoggerService } from '@/common/utils/logger/logger.service';
import loggerConfig from '@/config/logger.config';

@Injectable()
export class NotificationsService {
  private pubsubService: PubSub;
  private loggerService: LoggerService;

  constructor(private configService: ConfigService) {
    this.pubsubService = new PubSub();
    this.loggerService = new LoggerService(loggerConfig());
  }

  async sendNotification(data: NotificationMessage): Promise<void> {
    const topicName = this.configService.get('notifications.topicName');

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

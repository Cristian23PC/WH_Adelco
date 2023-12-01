import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import notificationsConfig from './config/notifications.config';

@Module({
  imports: [ConfigModule.forFeature(notificationsConfig)],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}

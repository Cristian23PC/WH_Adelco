import { registerAs } from '@nestjs/config';

export default registerAs('notifications', () => {
  return {
    topicName: process.env.NOTIFICATION_TOPIC_NAME
  };
});

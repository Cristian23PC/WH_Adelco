import { registerAs } from '@nestjs/config';

export default registerAs('custom-object', () => ({
  regionsContainer: process.env.REGIONS_CONTAINER_NAME ?? 'region'
}));

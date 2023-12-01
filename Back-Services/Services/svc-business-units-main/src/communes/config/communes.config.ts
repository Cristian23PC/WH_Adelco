import { registerAs } from '@nestjs/config';

export default registerAs('custom-object-commune', () => ({
  communesContainer: process.env.COMMUNE_CONTAINER_NAME ?? 'commune'
}));

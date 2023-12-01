import { registerAs } from '@nestjs/config';

export default registerAs('rut', () => ({
  verificationServiceUrl: process.env.RUT_VERIFICATION_SERVICE_URL
}));

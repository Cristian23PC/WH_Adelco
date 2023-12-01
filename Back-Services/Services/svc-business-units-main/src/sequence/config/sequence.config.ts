import { registerAs } from '@nestjs/config';

export default registerAs('custom-object-sequence', () => ({
  sequenceContainer: process.env.SEQUENCE_CONTAINER_NAME ?? 'sequence',
  businessUnitKey: process.env.BUSINESS_UNIT_KEY ?? 'businessUnitKey'
}));

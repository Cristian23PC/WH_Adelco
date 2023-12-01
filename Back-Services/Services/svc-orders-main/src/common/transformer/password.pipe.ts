import { ValueTransformer } from 'typeorm';
import { Hash } from '@/common/utils/hash/hash';

export class PasswordTransformer implements ValueTransformer {
  to(value: string | Buffer) {
    return Hash.make(value);
  }

  from(value: unknown) {
    return value;
  }
}

import { AbstractTransformPipe } from '@/common/transformer/abstract-transform.pipe';

export class TrimStringsPipe extends AbstractTransformPipe {
  except() {
    return ['password', 'passwordConfirmation'];
  }

  transformValue(value: unknown) {
    return typeof value === 'string' ? value.trim() : value;
  }
}

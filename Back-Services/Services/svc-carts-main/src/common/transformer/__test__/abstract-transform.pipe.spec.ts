import { AbstractTransformPipe } from '../abstract-transform.pipe';

class DummyService extends AbstractTransformPipe {
  protected transformValue(value: unknown): unknown {
    return value;
  }
  except(): string[] {
    return ['invalid'];
  }
}

describe('AbstractTransformPipe', () => {
  let abstractTransformPipe: AbstractTransformPipe;

  beforeEach(() => {
    abstractTransformPipe = new DummyService();
    jest.resetAllMocks();
  });

  it('should pase for string method', () => {
    expect(abstractTransformPipe.transform('values', { type: 'body' })).toEqual('values');
  });

  it('should pass for object method', () => {
    expect(abstractTransformPipe.transform([{ invalid: 'invalid' }, { values: 'values' }, 'value'], { type: 'body' })).toEqual([
      { invalid: 'invalid' },
      { values: 'values' },
      'value'
    ]);
  });

  describe('without expect service', () => {
    class DummyExpectService extends AbstractTransformPipe {
      protected transformValue(value: unknown): unknown {
        return value;
      }
    }

    beforeEach(() => {
      abstractTransformPipe = new DummyExpectService();
      jest.resetAllMocks();
    });

    it('should pass for object method and expect return empty array', () => {
      expect(abstractTransformPipe.transform([{ invalid: 'invalid' }, { values: 'values' }, 'value'], { type: 'body' })).toEqual([
        { invalid: 'invalid' },
        { values: 'values' },
        'value'
      ]);
    });
  });
});

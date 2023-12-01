import { TrimStringsPipe } from '../trim-strings.pipe';

describe('TrimStringsPipe', () => {
  let trimStringsPipe: TrimStringsPipe;

  beforeEach(() => {
    trimStringsPipe = new TrimStringsPipe();
    jest.resetAllMocks();
  });

  it('expect() method should be called', () => {
    expect(trimStringsPipe.except()).toEqual(['password', 'passwordConfirmation']);
  });

  describe('transformValue()', () => {
    it('should pass for the string method', () => {
      expect(trimStringsPipe.transformValue(' test ')).toEqual('test');
    });

    it('should pass for the not string', () => {
      expect(trimStringsPipe.transformValue([])).toEqual([]);
    });
  });
});

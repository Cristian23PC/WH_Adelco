import { removeUndefinedValues } from '../formatter';

describe('formatter', () => {
  describe('removeUndefinedValues', () => {
    it('Should return object without undefined values', () => {
      const data = {
        value1: '1',
        value2: undefined,
        value3: 3,
        value4: {
          subvalue1: 'a1',
          subvalue2: undefined
        }
      };

      const expectedResult = {
        value1: '1',
        value3: 3,
        value4: {
          subvalue1: 'a1'
        }
      };

      const result = removeUndefinedValues(data);

      expect(result).toStrictEqual(expectedResult);
    });
  });
});

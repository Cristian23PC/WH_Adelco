import { toQueryParams } from './Request';

describe('request utils', () => {
  describe('toQueryParams', () => {
    it('gets the query params from an object', () => {
      const queryParams = toQueryParams({
        offset: 0,
        limit: 10,
        text: 'some text'
      });
      expect(queryParams).toEqual('?offset=0&limit=10&text=some%20text');
    });
    it('should return empty string when param is not passed', () => {
      expect(toQueryParams({})).toBe('');
      expect(toQueryParams({ discounts: [] })).toBe('');
    });
  });
});

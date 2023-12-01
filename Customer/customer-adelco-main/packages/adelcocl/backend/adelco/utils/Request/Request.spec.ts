import { toQueryParams } from './Request';

describe('Utils Request', () => {
  describe('toQueryParams', () => {
    it('should return an empty string for an empty object', () => {
      const obj = {};
      expect(toQueryParams(obj)).toBe('');
    });

    it('should return an empty string for an empty array', () => {
      const obj: { foo: string[] } = { foo: [] };
      expect(toQueryParams(obj)).toBe('');
    });

    it('should convert an object with one property to a query string', () => {
      const obj = { foo: 'bar' };
      expect(toQueryParams(obj)).toBe('?foo=bar');
    });

    it('should convert an object with several properties to a query string', () => {
      const obj = { t2z: 'balmaceda', path: '/busqueda', locale: 'en' };
      expect(toQueryParams(obj)).toBe(
        '?t2z=balmaceda&path=%2Fbusqueda&locale=en'
      );
    });

    it('Should convert an object with an array property to a query string', () => {
      const obj = { foo: ['bar', 'baz'] };
      expect(toQueryParams(obj)).toBe('?foo=bar&foo=baz');
    });

    it('Should replace underscores with dots', () => {
      const obj = { foo_bar_tz: 'baz' };
      expect(toQueryParams(obj)).toBe('?foo.bar.tz=baz');
    });
  });
});

import { removeAccents, searchString } from './utils';

describe('utils', () => {
  describe('removeAccents', () => {
    it('should remove accents from a string', () => {
      const inputs = ['Café', 'Résümé - Héllo@Wörld!', 'Crème Brûlée'];
      const expectedOutputs = ['Cafe', 'Resume - Hello@World!', 'Creme Brulee'];

      expect(removeAccents(inputs[0])).toBe(expectedOutputs[0]);
      expect(removeAccents(inputs[1])).toBe(expectedOutputs[1]);
      expect(removeAccents(inputs[2])).toBe(expectedOutputs[2]);
    });

    it('should handle strings without accents', () => {
      const input = 'Hello World';
      const expectedOutput = 'Hello World';

      const result = removeAccents(input);

      expect(result).toBe(expectedOutput);
    });
  });

  describe('searchString', () => {
    it('should find a query in a string without accents', () => {
      const str = 'Café';
      const query = 'Cafe';

      const result = searchString(str, query);

      expect(result).toBe(true);
    });

    it('should find a query in a string regardless of the text position', () => {
      const str = 'Hello World';
      const query = 'world';

      const result = searchString(str, query);

      expect(result).toBe(true);
    });

    it('should return false when the query is not found', () => {
      const str = 'Example Text';
      const query = 'XYZ';

      const result = searchString(str, query);

      expect(result).toBe(false);
    });
  });
});

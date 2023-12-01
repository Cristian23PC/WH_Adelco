import { flatAttributesByName } from './product';

describe('Utils Product', () => {
  describe('flatAttributesByName', () => {
    it('should return an object with the correct flattened attributes by name', () => {
      const ctAttributes = [
        { name: 'Color', value: 'Blue' },
        { name: 'Size', value: 'Medium' },
        { name: 'Material', value: 'Cotton' }
      ];
      const expected = {
        Color: 'Blue',
        Size: 'Medium',
        Material: 'Cotton'
      };
      const result = flatAttributesByName(ctAttributes);
      expect(result).toEqual(expected);
    });

    it('should return an empty object if ctAttributes is empty', () => {
      const ctAttributes = [];
      const expected = {};
      const result = flatAttributesByName(ctAttributes);
      expect(result).toEqual(expected);
    });
  });
});

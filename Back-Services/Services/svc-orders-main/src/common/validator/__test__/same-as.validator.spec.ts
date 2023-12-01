import { validateSync } from 'class-validator';
import { SameAs } from '../same-as.validator';

describe('same-as', () => {
  describe('SameAs', () => {
    class TestClass {
      @SameAs('otherProperty')
      public property: string;

      public otherProperty: string;
    }

    it('should return true if property matches related property', () => {
      const testInstance = new TestClass();
      testInstance.property = 'testValue';
      testInstance.otherProperty = 'testValue';

      expect(testInstance.property).toBe('testValue');
    });

    it('should return true if property matches related property', () => {
      const testInstance = new TestClass();
      testInstance.property = 'testValue';
      testInstance.otherProperty = 'testValue';

      const validationErrors = validateSync(testInstance);
      expect(validationErrors.length).toBe(0);
    });

    it('should return false if property does not match related property', () => {
      const testInstance = new TestClass();
      testInstance.property = 'testValue';
      testInstance.otherProperty = 'otherValue';

      const validationErrors = validateSync(testInstance);
      expect(validationErrors.length).toBeGreaterThan(0);
    });
  });
});

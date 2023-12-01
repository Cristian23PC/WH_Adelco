/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { plainToInstance } from 'class-transformer';

import { Trim } from './custom-transformer';

describe('Custom Transformers', () => {
  describe('Trim', () => {
    class MyClass {
      @Trim()
      field: any;
    }

    describe('when the field is a string', () => {
      let result;

      beforeEach(() => {
        result = plainToInstance(MyClass, {
          field: ' test '
        });
      });

      test('should return a formatted string with no leading or trailing spaces', () => {
        expect(result.field).toEqual('test');
      });
    });

    describe('when the field is a not a string', () => {
      describe('when the field is a number', () => {
        let result;

        beforeEach(() => {
          result = plainToInstance(MyClass, {
            field: 8
          });
        });

        test('should return an unformatted number type', () => {
          expect(result.field).toEqual(8);
        });
      });

      describe('when the field is an array', () => {
        let result;

        beforeEach(() => {
          result = plainToInstance(MyClass, {
            field: [' test ', 8]
          });
        });

        test('should return an unformatted array type', () => {
          expect(result.field).toEqual([' test ', 8]);
        });
      });

      describe('when the field is an object', () => {
        let result;

        beforeEach(() => {
          result = plainToInstance(MyClass, {
            field: { id: 'test' }
          });
        });

        test('should return an unformatted array type', () => {
          expect(result.field).toEqual({ id: 'test' });
        });
      });
    });
  });
});

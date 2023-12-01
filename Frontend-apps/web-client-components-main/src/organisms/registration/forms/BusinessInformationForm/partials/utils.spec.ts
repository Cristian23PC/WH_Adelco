import { defaultPosition, getCoordinates, handleErrors } from './utils';

describe('utils', () => {
  describe('handleErrors', () => {
    it('Should return variant none and helperText undefined when there are no errors', () => {
      const errors = {};
      const field = 'RUT';

      const result = handleErrors(errors, field);

      expect(result).toEqual({
        variant: 'none',
        helperText: undefined
      });
    });

    it('Should return variant failure and helperText when there are errors', () => {
      const errors = {
        RUT: {
          message: 'RUT is required',
          ref: undefined,
          type: 'required'
        }
      };
      const field = 'RUT';

      const result = handleErrors(errors, field);

      expect(result).toEqual({
        variant: 'failure',
        helperText: 'RUT is required'
      });
    });
  });

  describe('getCoordinates', () => {
    // @ts-expect-error global fetch
    global.fetch = jest.fn(
      async () =>
        await Promise.resolve({
          json: async () =>
            await Promise.resolve({
              results: [
                {
                  geometry: {
                    location: {
                      lat: -99.9999,
                      long: -99.9999
                    }
                  }
                }
              ]
            })
        })
    );

    it('Should return position when request success', async () => {
      const address = 'some address';

      const result = await getCoordinates(address);

      expect(result).toEqual({
        lat: -33.4372,
        long: -70.6506
      });
    });

    it('Should return default position when request failed', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      global.fetch = jest.fn(async () => await Promise.reject('error'));
      const address = 'some address';

      const result = await getCoordinates(address);

      expect(result).toEqual(defaultPosition);
    });
  });
});

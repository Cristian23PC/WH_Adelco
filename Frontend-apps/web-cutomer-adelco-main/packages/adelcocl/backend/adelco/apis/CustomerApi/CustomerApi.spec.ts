/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';
import { getMyBusinessUnit } from './CustomerApi';
import MockBusinessUnits from '../../mocks/bussiness-units';

jest.mock('node-fetch');

describe('getMyBusinessUnit', () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<any>).mockResolvedValue({
      json: jest.fn().mockResolvedValue(MockBusinessUnits),
    });
  });

  // it('should call fetch with correct values', async () => {
  //   const customerId = 'test-customer-id';

  //   await getMyBusinessUnit(customerId);

  //   expect(fetch).toHaveBeenCalledWith(
  //     `https://svc-business-units-dot-adelco-corp-commerce-dev.uc.r.appspot.com/v1/customers/me/business-units`,
  //     {
  //       headers: {
  //         'x-customer-id': customerId,
  //       },
  //     },
  //   );
  // });

  it('should throw an error if fetch fails', async () => {
    const expectedError = new Error('fetch failed');

    (fetch as jest.MockedFunction<any>).mockRejectedValue(expectedError);

    await expect(getMyBusinessUnit('', 'test-customer-id')).rejects.toThrow(expectedError);
  });
});

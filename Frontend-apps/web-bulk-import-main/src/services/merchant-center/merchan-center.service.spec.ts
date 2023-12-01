import PricesService from './merchant-center.service';
import { fetcherForwardTo } from '../../common/utils/fetcherForwardTo';

jest.mock('../../common/utils/fetcherForwardTo');

describe('PricesService', () => {
  beforeEach(() => {
    (fetcherForwardTo as jest.Mock).mockClear();
  });

  // it('should call fetcherForwardTo with the correct URL and formData', async () => {
  //   const formData = new FormData();
  //   const mockUrl = 'mock-url';
  //   process.env.REACT_APP_BULK_IMPORT_PRICES_URL = mockUrl;

  //   await PricesService.updatePrices(formData);

  //   expect(fetcherForwardTo).toHaveBeenCalledWith(mockUrl, formData);
  // });

  it('should return the result from fetcherForwardTo', async () => {
    const formData = new FormData();
    const mockUrl = 'mock-url';
    process.env.BULK_IMPORT_PRICES_URL = mockUrl;
    const mockResult = { success: true };

    (fetcherForwardTo as jest.Mock).mockResolvedValue(mockResult);

    const result = await PricesService.updatePrices(mockUrl, formData);

    expect(result).toEqual(mockResult);
  });

  it('should handle errors', async () => {
    const formData = new FormData();
    const mockUrl = 'mock-url';
    process.env.BULK_IMPORT_PRICES_URL = mockUrl;
    const mockError = new Error('Mock Error');

    (fetcherForwardTo as jest.Mock).mockRejectedValue(mockError);

    await expect(PricesService.updatePrices(mockUrl, formData)).rejects.toThrow(
      mockError
    );
  });
});

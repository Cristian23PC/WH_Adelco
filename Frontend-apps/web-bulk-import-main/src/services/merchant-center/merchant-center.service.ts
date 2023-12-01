import { fetcherForwardTo } from '../../common/utils/fetcherForwardTo';

export class PricesService {
  static async updatePrices(url: string, formData: FormData) {
    return await fetcherForwardTo(
      `${url}/merchant-center/v1/bulk-import-prices`,
      formData
    );
  }
}
export default PricesService;

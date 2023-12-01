import { AxiosError } from 'axios';
import axios, { RequestData } from '../utils/axiosInstance';

export const convertActiveCartInOrderApi = async (
  requestData: RequestData,
  businessUnitId: string,
  order: any
) => {
  try {
    const { baseURL, headers } = requestData;
    const { data } = await axios.post(
      `${baseURL}/business-unit/${businessUnitId}/orders/convert-active-cart`,
      order,
      { headers }
    );

    return data;
  } catch (e) {
    throw e as AxiosError;
  }
};

import axios, { RequestData } from '../../utils/axiosInstance';
import { ApiResponseType } from '../../utils/Request';

export const getCartById = async (
  requestData: RequestData,
  deliveryZone: string
) => {
  const { baseURL, headers } = requestData;
  const url = `${baseURL}/carts/anonymous-cart`;
  const { data, sessionData } = await axios.get<unknown, ApiResponseType<any>>(
    url,
    {
      params: { deliveryZone },
      headers
    }
  );

  return { data, sessionData };
};

export const setLineItemQuantity = async (
  requestData: RequestData,
  lineItemId: string,
  quantity: number
) => {
  const { baseURL, headers } = requestData;
  const url = `${baseURL}/carts/anonymous-cart/line-items/${lineItemId}/quantity`;
  const { data, sessionData } = await axios.patch<
    unknown,
    ApiResponseType<any>
  >(url, { quantity }, { headers });

  return { data, sessionData };
};

export const removeLineItem = async (
  requestData: RequestData,
  lineItemId: string
) => {
  const { baseURL, headers } = requestData;
  const url = `${baseURL}/carts/anonymous-cart/line-items/${lineItemId}`;
  const { data, sessionData } = await axios.delete<
    unknown,
    ApiResponseType<any>
  >(url, { headers });

  return { data, sessionData };
};

export const emptyCart = async (requestData: RequestData) => {
  const { baseURL, headers } = requestData;
  const url = `${baseURL}/carts/anonymous-cart`;
  const { data, sessionData } = await axios.delete<
    unknown,
    ApiResponseType<any>
  >(url, { headers });

  return { data, sessionData };
};

export const addLineItem = async (
  requestData: RequestData,
  deliveryZone: string,
  sku: string,
  quantity: number
) => {
  const { baseURL, headers } = requestData;
  const url = `${baseURL}/carts/anonymous-cart/line-items`;
  const { data, sessionData } = await axios.post<unknown, ApiResponseType<any>>(
    url,
    { sku, quantity },
    { params: { deliveryZone }, headers }
  );

  return { data, sessionData };
};

export const createOrderContactRequest = async (
  requestData: RequestData,
  payload: any
) => {
  const { baseURL, headers } = requestData;
  const url = `${baseURL}/carts/anonymous-cart/order-contact-request`;
  const { data, sessionData } = await axios.post<unknown, ApiResponseType<any>>(
    url,
    payload,
    { headers }
  );
  return { data, sessionData };
};

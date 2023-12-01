import axios, { RequestData } from '../../utils/axiosInstance';
import { ApiResponseType } from '../../utils/Request';
import { Cart, DeliveryDatesResponse } from '@Types/adelco/cart';

export const getCartById = async (
  requestData: RequestData,
  businessUnitId: string
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<unknown, ApiResponseType<any>>(
    `${baseURL}/business-unit/${businessUnitId}/carts/active`,
    { headers }
  );

  return { data, sessionData };
};

export const setLineItemQuantity = async (
  requestData: RequestData,
  businessUnitId: string,
  itemId: string,
  quantity: number
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.patch<
    unknown,
    ApiResponseType<any>
  >(
    `${baseURL}/business-unit/${businessUnitId}/carts/active/line-items/${itemId}/quantity`,
    { quantity },
    { headers }
  );

  return { data, sessionData };
};

export const removeLineItem = async (
  requestData: RequestData,
  businessUnitId: string,
  itemId: string
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.delete<
    unknown,
    ApiResponseType<any>
  >(
    `${baseURL}/business-unit/${businessUnitId}/carts/active/line-items/${itemId}`,
    { headers }
  );

  return { data, sessionData };
};

export const emptyCart = async (
  requestData: RequestData,
  businessUnitId: string
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.delete<
    unknown,
    ApiResponseType<any>
  >(`${baseURL}/business-unit/${businessUnitId}/carts/active`, { headers });
  return { data, sessionData };
};

export const addLineItem = async (
  requestData: RequestData,
  businessUnitId: string,
  sku: string,
  quantity: number
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.post<unknown, ApiResponseType<any>>(
    `${baseURL}/business-unit/${businessUnitId}/carts/active/line-items`,
    { sku, quantity },
    { headers: { businessUnitId, ...headers } }
  );

  return { data, sessionData };
};

export const addDiscountCode = async (
  requestData: RequestData,
  businessUnitId: string,
  code: string
) => {
  const { baseURL, headers } = requestData;
  const { data } = await axios.patch(
    `${baseURL}/business-unit/${businessUnitId}/carts/active/discount-code`,
    { code },
    { headers }
  );

  return data;
};

export const removeDiscountCode = async (
  requestData: RequestData,
  businessUnitId: string,
  code: string
) => {
  const { baseURL, headers } = requestData;
  const { data } = await axios.delete(
    `${baseURL}/business-unit/${businessUnitId}/carts/active/discount-code/${code}`,
    { headers }
  );

  return data;
};

export const getPaymentMethods = async (
  requestData: RequestData,
  businessUnitId: string
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<unknown, ApiResponseType<any>>(
    `${baseURL}/business-unit/${businessUnitId}/active/payment-methods`,
    { headers }
  );

  return { data, sessionData };
};

export const getDeliveryDates = async (
  requestData: RequestData,
  businessUnitId: string
): ApiResponseType<DeliveryDatesResponse> => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<
    unknown,
    ApiResponseType<DeliveryDatesResponse>
  >(`${baseURL}/business-unit/${businessUnitId}/carts/active/delivery-dates`, {
    headers
  });

  return { data, sessionData };
};

export const mergeAnonymousCart = async (
  requestData: RequestData,
  businessUnitId: string,
  cartId: string
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.post<
    unknown,
    ApiResponseType<Cart>
  >(
    `${baseURL}/business-unit/${businessUnitId}/carts/cart-merge-request`,
    { cartId },
    { headers }
  );

  return { data, sessionData };
};

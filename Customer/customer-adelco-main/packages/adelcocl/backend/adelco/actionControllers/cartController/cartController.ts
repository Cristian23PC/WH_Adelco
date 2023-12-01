import { Request, ActionContext, Response } from '@frontastic/extension-types';
import {
  getCartById,
  setLineItemQuantity as setLineItemQuantityApi,
  removeLineItem as removeLineItemApi,
  emptyCart as emptyCartApi,
  addLineItem as addLineItemApi,
  addDiscountCode,
  removeDiscountCode,
  getPaymentMethods as getPaymentMethodsApi,
  getDeliveryDates as getDeliveryDatesApi,
  mergeAnonymousCart as mergeAnonymousCartApi
} from '../../apis/CartApi';
import { AxiosErrorData } from '@Types/adelco/general/AdelcoError';
import { getDataFromContext } from '../../utils/axiosInstance';

export const getCart = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    if (!request.sessionData?.userAccount?.businessUnitId) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'user not logged in' })
      };
    }
    const { businessUnitId } = request?.sessionData?.userAccount;
    const { data: cart, sessionData } = await getCartById(
      requestData,
      businessUnitId
    );

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

type LineItem = {
  id: string;
  quantity: number;
};

export const setLineItemQuantity = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { id, quantity } = JSON.parse(request.body) as LineItem;
    const { businessUnitId } = request?.sessionData?.userAccount;

    const { data: cart, sessionData } = await setLineItemQuantityApi(
      requestData,
      businessUnitId,
      id,
      quantity
    );
    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

export const emptyCart = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { businessUnitId } = request?.sessionData?.userAccount;
    const { sessionData } = await emptyCartApi(requestData, businessUnitId);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

export const removeLineItem = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { id } = JSON.parse(request.body) as Pick<LineItem, 'id'>;
    const { businessUnitId } = request?.sessionData?.userAccount;

    const { data: cart, sessionData } = await removeLineItemApi(
      requestData,
      businessUnitId,
      id
    );
    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

export const addLineItem = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { sku, quantity } = JSON.parse(request.body);

    const { businessUnitId } = request?.sessionData?.userAccount;
    const { data: cart, sessionData } = await addLineItemApi(
      requestData,
      businessUnitId,
      sku,
      quantity
    );
    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

export const addCoupon = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { code } = JSON.parse(request.body);
    const { businessUnitId } = request?.sessionData?.userAccount;
    const cart = await addDiscountCode(requestData, businessUnitId, code);
    return {
      statusCode: 200,
      body: JSON.stringify(cart)
    };
  } catch (error) {
    return {
      statusCode: (error as AxiosErrorData).statusCode,
      body: JSON.stringify({ error })
    };
  }
};

export const removeCoupon = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { code } = JSON.parse(request.body);
    const { businessUnitId } = request?.sessionData?.userAccount;
    const cart = await removeDiscountCode(requestData, businessUnitId, code);
    return {
      statusCode: 200,
      body: JSON.stringify(cart)
    };
  } catch (error) {
    return {
      statusCode: (error as AxiosErrorData).statusCode,
      body: JSON.stringify({ error })
    };
  }
};

export const getPaymentMethods = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { businessUnitId } = request?.sessionData?.userAccount;
    const { data, sessionData } = await getPaymentMethodsApi(
      requestData,
      businessUnitId
    );
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (error) {
    return {
      statusCode: (error as AxiosErrorData).statusCode,
      body: JSON.stringify({ error })
    };
  }
};

export const getDeliveryDates = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );

    const { businessUnitId } = request?.sessionData?.userAccount;

    const { data, sessionData } = await getDeliveryDatesApi(
      requestData,
      businessUnitId
    );
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (error) {
    return {
      statusCode: (error as AxiosErrorData).statusCode,
      body: JSON.stringify({ error })
    };
  }
};

export const mergeAnonymousCart = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );

    const { businessUnitId, cartId } = JSON.parse(request.body);

    const { data, sessionData } = await mergeAnonymousCartApi(
      requestData,
      businessUnitId,
      cartId
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (error) {
    return {
      statusCode: (error as AxiosErrorData).statusCode || 500,
      body: JSON.stringify({ error })
    };
  }
};

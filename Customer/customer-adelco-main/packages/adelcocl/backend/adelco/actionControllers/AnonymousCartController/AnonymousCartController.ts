import {
  ActionContext,
  Request,
  /* ActionContext, */ Response
} from '@frontastic/extension-types';
import {
  getCartById,
  setLineItemQuantity as setLineItemQuantityApi,
  removeLineItem as removeLineItemApi,
  addLineItem as addLineItemApi,
  emptyCart as emptyCartApi,
  createOrderContactRequest as createOrderContactRequestApi
} from '../../apis/AnonymousCartApi';
import { AxiosErrorData } from '@Types/adelco/general/AdelcoError';
import { getDataFromContext } from '../../utils/axiosInstance';

export const getCart = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const { zoneId } = request.sessionData?.userAccount || {};
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );

    if (!zoneId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'El usuario anónimo no ha seleccionado una region y comuna.'
        })
      };
    }

    const { data: cart, sessionData } = await getCartById(requestData, zoneId);

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
    const { id, quantity } = JSON.parse(request.body) as LineItem;
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { data: cart, sessionData } = await setLineItemQuantityApi(
      requestData,
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
    const { data: cart, sessionData } = await removeLineItemApi(
      requestData,
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
    const { sku, quantity } = JSON.parse(request.body);
    const { zoneId } = request?.sessionData?.userAccount;
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { data: cart, sessionData } = await addLineItemApi(
      requestData,
      zoneId,
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

export const emptyCart = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { sessionData } = await emptyCartApi(requestData);

    return {
      statusCode: 200,
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

export const createOrderContactRequest = async (
  request: Request,
  context: ActionContext
) => {
  try {
    const payload = JSON.parse(request.body);
    const requestData = await getDataFromContext(
      { ...context, request },
      'cart'
    );
    const { sessionData, data } = await createOrderContactRequestApi(
      requestData,
      payload
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

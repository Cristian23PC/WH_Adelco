import { Request, ActionContext, Response } from '@frontastic/extension-types';
import {
  getCartById,
  setLineItemQuantity as setLineItemQuantityApi,
  removeLineItem as removeLineItemApi,
  emptyCart as emptyCartApi,
  addLineItem as addLineItemApi,
} from '../../apis/CartApi';

export const getCart = async (request: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.cart;
  if (!request.sessionData?.userAccount?.businessUnitId) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'user not logged in' }),
    };
  }
  const { businessUnitId } = request?.sessionData?.userAccount;
  const cart = await getCartById(baseURL, businessUnitId);

  return {
    statusCode: 200,
    body: JSON.stringify(cart),
  };
};

type LineItem = {
  id: string;
  quantity: number;
};
export const setLineItemQuantity = async (request: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.cart;
  const { id, quantity } = JSON.parse(request.body) as LineItem;
  const { businessUnitId } = request?.sessionData?.userAccount;
  const cart = await setLineItemQuantityApi(baseURL, businessUnitId, id, quantity);

  return {
    statusCode: 200,
    body: JSON.stringify(cart),
  };
};

export const emptyCart = async (request: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.cart;
  const lineItemIds: string[] = JSON.parse(request.body);
  const { businessUnitId } = request?.sessionData?.userAccount;
  try {
    const cart = await emptyCartApi(baseURL, businessUnitId, lineItemIds);
    return {
      statusCode: 200,
      body: JSON.stringify(cart),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const removeLineItem = async (request: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.cart;
  const { id } = JSON.parse(request.body) as Pick<LineItem, 'id'>;
  const { businessUnitId } = request?.sessionData?.userAccount;
  const cart = await removeLineItemApi(baseURL, businessUnitId, id);
  return {
    statusCode: 200,
    body: JSON.stringify(cart),
  };
};

export const addLineItem = async (request: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.cart;
  const { sku, quantity } = JSON.parse(request.body);

  const { businessUnitId } = request?.sessionData?.userAccount;
  const cart = await addLineItemApi(baseURL, businessUnitId, sku, quantity);
  return {
    statusCode: 200,
    body: JSON.stringify(cart),
  };
};

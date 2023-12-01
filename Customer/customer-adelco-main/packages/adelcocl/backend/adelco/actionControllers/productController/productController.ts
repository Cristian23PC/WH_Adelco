import {
  Request,
  Response,
  DynamicPageContext
} from '@frontastic/extension-types';
import {
  getProducts,
  getCategoryProducts,
  getProduct as getProductBySlug
} from '../../utils/products';
import { AxiosErrorData } from '@Types/adelco/general/AdelcoError';

export const searchProducts = async (
  request: Request,
  context: DynamicPageContext
): Promise<Response> => {
  try {
    const { slug } = (JSON.parse(request.body) as { slug?: string }) || {};
    const { data: products, sessionData } = await (slug
      ? getCategoryProducts(request, context, slug)
      : getProducts(request, context));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
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

export const searchProduct = async (
  request: Request,
  context: DynamicPageContext
): Promise<Response> => {
  const { slug } = (JSON.parse(request.body) as { slug?: string }) || {};
  const { data: product, sessionData } = await getProductBySlug(
    request,
    context,
    slug
  );
  return {
    statusCode: 200,
    body: JSON.stringify(product),
    sessionData: {
      ...request.sessionData,
      ...sessionData
    }
  };
};

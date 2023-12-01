import { Request, Response, DynamicPageContext } from '@frontastic/extension-types';
import { getProducts } from '../../utils/products';

export const searchProducts = async (request: Request, context: DynamicPageContext): Promise<Response> => {
  const products = await getProducts(request, context);
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};

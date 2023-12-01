import { Request, DynamicPageContext } from '@frontastic/extension-types';
import { getProductBySlug } from '../apis/ProductApi';
import { getPath } from './Request';
import { getDataFromContext } from './axiosInstance';

const regexp = /\/producto\/([^\/]+)\/?$/;

export class ProductDetailsRouter {
  static identifyFrom(request: Request) {
    return regexp.test(getPath(request));
  }

  static async loadFor(request: Request, context: DynamicPageContext) {
    const requestData = await getDataFromContext(
      { ...context, request },
      'product'
    );
    const [, slug] = getPath(request)?.match(regexp) || [];
    const {
      dch,
      t2z,
      useT2Rate = true,
      taxProfile
    } = request.sessionData?.userAccount || {};

    return getProductBySlug(requestData, slug, {
      useT2Rate,
      ...(dch && t2z && { dch, t2z }),
      ...(taxProfile && { taxProfile })
    });
  }
}

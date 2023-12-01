import { Request, DynamicPageContext } from '@frontastic/extension-types';
import { getProductBySlug } from '../apis/ProductApi';
import { getPath } from './Request';

const regexp = /\/product\/([^\/]+)\/?$/;

export class ProductDetailsRouter {
  static identifyFrom(request: Request) {
    return regexp.test(getPath(request));
  }

  static async loadFor(request: Request, context: DynamicPageContext) {
    const baseURL = context.frontasticContext?.project.configuration.msURL.product;

    const [, slug] = getPath(request)?.match(regexp) || [];
    const { dch, t2z } = request.sessionData?.userAccount || {};

    return getProductBySlug(baseURL, slug, { ...(dch && t2z && { dch, t2z }) });
  }
}

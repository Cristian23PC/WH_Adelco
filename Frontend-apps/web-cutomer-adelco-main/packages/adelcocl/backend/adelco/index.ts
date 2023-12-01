import {
  DataSourceConfiguration,
  Request,
  DynamicPageSuccessResult,
  DataSourceContext,
  DynamicPageContext,
} from '@frontastic/extension-types';
import { findProducts, findProductsByCategory } from './apis/ProductApi';
import { getCategories, findCategories } from './apis/CategoryApi';
import { SearchRouter } from './utils/SearchRouter';
import { CategoryRouter } from './utils/CategoryRouter';
import * as UserAccountActions from './actionControllers/UserAccountController';
import * as BusinessUnitActions from './actionControllers/BusinessUnitController';
import * as cartAcctions from './actionControllers/cartController';
import * as productAction from './actionControllers/productController';
import { toQueryParams } from './utils/Request';
import { ProductDetailsRouter } from './utils/ProductDetailsRouter';
import { getCategoryBreadcrumb } from './utils/categories';
import { expandedCtCategoryToBreadcrumb } from './utils/mappers/categories';
import { getProducts } from './utils/products';

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | null> => {
    if (SearchRouter.identifyFrom(request)) {
      try {
        const result = await getProducts(request, context);

        return {
          dynamicPageType: 'adelco/search',
          dataSourcePayload: result,
        };
      } catch (e) {
        return {
          dynamicPageType: 'adelco/search',
          dataSourcePayload: { results: [], total: 0, limit: 20, count: 0, offset: 0 },
        };
      }
    }

    if (CategoryRouter.identifyFrom(request)) {
      try {
        const categoryResult = await CategoryRouter.getCategory(request, context);
        const category = categoryResult.results?.[0];
        const result = await CategoryRouter.loadFor(request, context);
        return {
          dynamicPageType: 'adelco/category',
          dataSourcePayload: {
            ...result,
            category,
            breadcrumb: expandedCtCategoryToBreadcrumb(category),
          },
        };
      } catch (e) {
        return {
          dynamicPageType: 'adelco/category',
          dataSourcePayload: { results: [], total: 0, limit: 20, count: 0, offset: 0 },
        };
      }
    }

    if (ProductDetailsRouter.identifyFrom(request)) {
      const product = await ProductDetailsRouter.loadFor(request, context);
      const lastCategoryId = product.categories[product.categories.length - 1]?.id;
      const msURL = context.frontasticContext?.project.configuration.msURL.product;
      const baseURL = `${msURL}/categories`;
      return {
        dynamicPageType: 'adelco/product-details',
        dataSourcePayload: {
          product,
          sessionData: request.sessionData,
          breadcrumb: await getCategoryBreadcrumb(baseURL, lastCategoryId),
        },
      };
    }

    return null;
  },
  'data-sources': {
    'adelco/product-list': async (_: DataSourceConfiguration, context: DataSourceContext) => {
      const msURL = context.frontasticContext?.project.configuration.msURL.product;
      const baseURL = `${msURL}/products`;
      try {
        const productsResultPage = await findProducts(baseURL, '');

        return {
          dataSourcePayload: productsResultPage,
        };
      } catch (e) {
        return e;
      }
    },
    'adelco/complete-category-list': async (_: DataSourceConfiguration, context: DataSourceContext) => {
      const baseURL = context.frontasticContext?.project.configuration.msURL.product;
      try {
        const parameters = {
          rootKey: 'C101',
          childLevels: '3',
        };
        const categoriesResult = await getCategories(baseURL, toQueryParams(parameters));

        return {
          dataSourcePayload: {
            categories: categoriesResult,
          },
        };
      } catch (e) {
        return e;
      }
    },
    'adelco/category-list': async (_: DataSourceConfiguration, context: DataSourceContext) => {
      const baseURL = context.frontasticContext?.project.configuration.msURL.product;
      try {
        const parameters = {
          rootKey: 'C101',
          childLevels: '2',
        };
        const categoriesResult = await getCategories(baseURL, toQueryParams(parameters));

        return {
          dataSourcePayload: {
            categories: categoriesResult,
            sessionData: context.request.sessionData,
          },
        };
      } catch (e) {
        return e;
      }
    },
    'adelco/category-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      const baseURL = context.frontasticContext?.project.configuration.msURL.product;

      const {
        configuration: {
          slug: { es_CL: slug },
        },
      } = config;
      try {
        const params = { where: `slug(es-CL="${slug}")` };
        const categoriesResult = await findCategories(baseURL, toQueryParams(params));
        let payload;
        if (categoriesResult.results[0]) {
          const { dch, t2z } = context.request.sessionData?.userAccount || {};
          const queryParams = {
            limit: '5',
            ...(dch && t2z && { dch, t2z }),
          };
          const productsResults = await findProductsByCategory(baseURL, toQueryParams(queryParams), slug);
          payload = {
            category: categoriesResult.results[0],
            sessionData: context.request.sessionData,
            ...productsResults,
          };
        }
        return {
          dataSourcePayload: payload,
        };
      } catch (e) {
        return e;
      }
    },
    'adelco/product-details': async () => {
      return {
        dataSourcePayload: {},
      };
    },
    'adelco/user-details': async (_: DataSourceConfiguration, context: DataSourceContext) => {
      return {
        dataSourcePayload: context.request.sessionData?.userAccount || { isFirstTime: true },
      };
    },
  },
  actions: {
    userAccount: UserAccountActions,
    businessUnits: BusinessUnitActions,
    cart: cartAcctions,
    product: productAction,
  },
};

import {
  DataSourceConfiguration,
  Request,
  DynamicPageSuccessResult,
  DataSourceContext,
  DynamicPageContext
} from '@frontastic/extension-types';
import { findProducts, findProductsByCategory } from './apis/ProductApi';
import { getCategories, findCategories } from './apis/CategoryApi';
import { SearchRouter } from './utils/SearchRouter';
import { CategoryRouter } from './utils/CategoryRouter';
import * as UserAccountActions from './actionControllers/UserAccountController';
import * as BusinessUnitActions from './actionControllers/BusinessUnitController';
import * as cartActions from './actionControllers/cartController';
import * as orderActions from './actionControllers/OrderController';
import * as anonymousCartActions from './actionControllers/AnonymousCartController';
import * as productAction from './actionControllers/productController';
import { toQueryParams } from './utils/Request';
import { ProductDetailsRouter } from './utils/ProductDetailsRouter';
import {
  getCategoryBreadcrumb,
  getCategorySlugByUrl,
  getCategoryUrl
} from './utils/categories';
import { expandedCtCategoryToBreadcrumb } from './utils/mappers/categories';
import { getProducts } from './utils/products';
import { getCategoryProducts } from './utils/products/products';
import { getDataFromContext } from './utils/axiosInstance';

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext
  ): Promise<DynamicPageSuccessResult | null> => {
    if (SearchRouter.identifyFrom(request)) {
      try {
        const { data: result, sessionData } = await getProducts(
          request,
          context
        );

        return {
          dynamicPageType: 'adelco/search',
          dataSourcePayload: {
            ...result,
            sessionData: {
              ...request.sessionData,
              ...sessionData
            }
          }
        };
      } catch (e) {
        return {
          dynamicPageType: 'adelco/search',
          dataSourcePayload: {
            results: [],
            total: 0,
            limit: 20,
            count: 0,
            offset: 0
          }
        };
      }
    }

    if (CategoryRouter.identifyFrom(request)) {
      try {
        const { data: categoryResult } = await CategoryRouter.getCategory(
          request,
          context
        );
        const category = categoryResult.results?.[0];
        const { data: result, sessionData } = await getCategoryProducts(
          request,
          context,
          getCategorySlugByUrl(request)
        );
        return {
          dynamicPageType: 'adelco/category',
          dataSourcePayload: {
            ...result,
            category,
            breadcrumb: expandedCtCategoryToBreadcrumb(category),
            sessionData: {
              ...request.sessionData,
              ...sessionData
            }
          }
        };
      } catch (e) {
        return {
          dynamicPageType: 'adelco/category',
          dataSourcePayload: {
            results: [],
            total: 0,
            limit: 20,
            count: 0,
            offset: 0
          }
        };
      }
    }

    if (ProductDetailsRouter.identifyFrom(request)) {
      const { data: product, sessionData } = await ProductDetailsRouter.loadFor(
        request,
        context
      );
      const lastCategoryId =
        product.categories[product.categories.length - 1]?.id;
      const requestData = await getDataFromContext(
        { ...context, request },
        'product'
      );
      return {
        dynamicPageType: 'adelco/product-details',
        dataSourcePayload: {
          product,
          sessionData: { ...request.sessionData, ...sessionData },
          breadcrumb: await getCategoryBreadcrumb(requestData, lastCategoryId)
        }
      };
    }

    return null;
  },
  'data-sources': {
    'adelco/product-list': async (
      _: DataSourceConfiguration,
      context: DataSourceContext
    ) => {
      const requestData = await getDataFromContext(context, 'product');
      requestData.baseURL += '/products';

      try {
        const { data: productsResultPage } = await findProducts(
          requestData,
          toQueryParams({ filter: 'variants.attributes.price:exists' })
        );

        return {
          dataSourcePayload: productsResultPage
        };
      } catch (e) {
        return e;
      }
    },
    'adelco/complete-category-list': async (
      _: DataSourceConfiguration,
      context: DataSourceContext
    ) => {
      const requestData = await getDataFromContext(context, 'product');
      try {
        const parameters = {
          rootKey: 'C101',
          childLevels: '3'
        };
        const { data: categoriesResult } = await getCategories(
          requestData,
          toQueryParams(parameters)
        );

        return {
          dataSourcePayload: {
            categories: categoriesResult
          }
        };
      } catch (e) {
        return e;
      }
    },
    'adelco/category-list': async (
      _: DataSourceConfiguration,
      context: DataSourceContext
    ) => {
      const requestData = await getDataFromContext(context, 'product');
      try {
        const parameters = {
          rootKey: 'C101',
          childLevels: '2'
        };
        const { data: categoriesResult, sessionData } = await getCategories(
          requestData,
          toQueryParams(parameters)
        );

        return {
          dataSourcePayload: {
            categories: categoriesResult,
            sessionData: { ...context.request.sessionData, ...sessionData }
          }
        };
      } catch (e) {
        return e;
      }
    },
    'adelco/category-products': async (
      config: DataSourceConfiguration,
      context: DataSourceContext
    ) => {
      const requestData = await getDataFromContext(context, 'product');

      const {
        configuration: {
          slug: { es_CL: slug }
        }
      } = config;
      try {
        const params = { where: `slug(es-CL="${slug}")` };
        const { data: categoriesResult, sessionData } = await findCategories(
          requestData,
          toQueryParams(params)
        );
        let payload;
        if (categoriesResult.results[0]) {
          const {
            dch,
            t2z,
            useT2Rate = true,
            taxProfile
          } = context.request.sessionData?.userAccount || {};
          const queryParams = {
            limit: '5',
            useT2Rate,
            filter: 'variants.attributes.price:exists',
            ...(taxProfile && { taxProfile }),
            ...(dch && t2z && { dch, t2z })
          };
          const { data: productsResults } = await findProductsByCategory(
            requestData,
            toQueryParams(queryParams),
            slug
          );
          payload = {
            category: categoriesResult.results[0],
            categoryUrl: await getCategoryUrl(
              requestData,
              categoriesResult.results[0].id
            ),
            sessionData: { ...context.request.sessionData, ...sessionData },
            ...productsResults
          };
        }
        return {
          dataSourcePayload: payload
        };
      } catch (e) {
        return e;
      }
    },
    'adelco/product-details': async () => {
      return {
        dataSourcePayload: {}
      };
    },
    'adelco/user-details': async (
      _: DataSourceConfiguration,
      context: DataSourceContext
    ) => {
      return {
        dataSourcePayload: context.request.sessionData?.userAccount || {
          isFirstTime: true
        }
      };
    }
  },
  actions: {
    userAccount: UserAccountActions,
    businessUnits: BusinessUnitActions,
    cart: cartActions,
    anonymousCart: anonymousCartActions,
    product: productAction,
    order: orderActions
  }
};

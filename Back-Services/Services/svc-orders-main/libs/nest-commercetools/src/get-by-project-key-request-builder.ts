import {
  AuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
  JsonObject,
} from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';

import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { NestCommercetoolsModuleOptions } from './interfaces/nest-commercetools-options.interface';
import { CommercetoolsError } from './errors/commercetools.error';

export default (
  options: NestCommercetoolsModuleOptions,
): ByProjectKeyRequestBuilder => {
  const { auth, http, logger, middleware, queue, projectKey } = options;

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    ...http,
    fetch: http.fetch || fetch,
  };

  const clientBuilder: ClientBuilder = new ClientBuilder()
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions);

  if (auth) {
    const authMiddlewareOptions: AuthMiddlewareOptions = {
      ...auth,
      fetch: auth.fetch || fetch,
    };
    clientBuilder.withClientCredentialsFlow(authMiddlewareOptions);
  }

  if (logger) {
    clientBuilder.withLoggerMiddleware();
  }

  clientBuilder.withMiddleware((next) => {
    return (request, response) => {
      next(request, {
        ...response,
        reject: (error) => {
          response.reject(
            <JsonObject<CommercetoolsError>>(
              (<unknown>new CommercetoolsError(error))
            ),
          );
        },
      });
    };
  });

  if (middleware) {
    clientBuilder.withMiddleware(middleware);
  }

  if (queue) {
    clientBuilder.withQueueMiddleware(queue);
  }

  const ctpClient: Client = clientBuilder.build();

  const apiRoot: ApiRoot = createApiBuilderFromCtpClient(ctpClient);
  return apiRoot.withProjectKey({ projectKey });
};

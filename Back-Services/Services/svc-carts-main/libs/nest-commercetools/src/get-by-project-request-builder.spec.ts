import { ClientBuilder, Dispatch } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import fetch from 'node-fetch';
import getByProjectKeyRequestBuilder from './get-by-project-key-request-builder';
import { NestCommercetoolsModuleOptions } from './interfaces/nest-commercetools-options.interface';

jest.mock('node-fetch', () => {
  const originalModule = jest.requireActual('node-fetch');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => Promise.resolve(new Response())),
  };
});

const mockClientBuilder = {
  withProjectKey: jest.fn().mockReturnThis(),
  withHttpMiddleware: jest.fn().mockReturnThis(),
  withLoggerMiddleware: jest.fn().mockReturnThis(),
  withClientCredentialsFlow: jest.fn().mockReturnThis(),
  withMiddleware: jest.fn().mockReturnThis(),
  withQueueMiddleware: jest.fn().mockReturnThis(),
  build: jest.fn(() => ({ id: 'client' })),
};

jest.mock('@commercetools/sdk-client-v2', () => {
  const originalModule = jest.requireActual('@commercetools/sdk-client-v2');
  return {
    __esModule: true,
    ...originalModule,
    ClientBuilder: jest.fn().mockImplementation(() => mockClientBuilder),
  };
});

const apiRoot = {
  withProjectKey: jest.fn(() => ({ id: 'byProjectKeyRequestBuilder' })),
};

jest.mock('@commercetools/platform-sdk', () => {
  const originalModule = jest.requireActual('@commercetools/platform-sdk');
  return {
    __esModule: true,
    ...originalModule,
    createApiBuilderFromCtpClient: jest.fn(() => apiRoot),
  };
});

describe('Get byProjectKeyRequestBuilder', () => {
  let byProjectKeyRequestBuilder: any;
  let options: NestCommercetoolsModuleOptions;
  let customFetch: (
    input: RequestInfo,
    init?: RequestInit | undefined,
  ) => Promise<Response>;
  let clientBuilder: ClientBuilder;

  beforeAll(() => {
    clientBuilder = new ClientBuilder();
    customFetch = () => Promise.resolve(new Response());
  });

  describe('when auth provided', () => {
    describe('when fetch provided', () => {
      beforeAll(() => {
        options = {
          auth: {
            host: 'https://auth.commercetools.co',
            projectKey: 'projectKey',
            credentials: {
              clientId: 'clientId',
              clientSecret: 'clientSecret',
            },
            fetch: customFetch,
          },
          http: {
            host: 'https://api.commercetools.co',
            enableRetry: true,
            retryConfig: {
              maxRetries: 3,
            },
            fetch: customFetch,
          },
          projectKey: 'projectKey',
        };
      });

      beforeEach(() => {
        byProjectKeyRequestBuilder = getByProjectKeyRequestBuilder(options);
      });

      test("should call 'clientBuilder.withProjectKey'", () => {
        expect(clientBuilder.withProjectKey).toHaveBeenCalledWith(
          options.projectKey,
        );
      });

      test("should call 'clientBuilder.withHttpMiddleware'", () => {
        expect(clientBuilder.withHttpMiddleware).toHaveBeenCalledWith(
          options.http,
        );
      });

      test("should not call 'clientBuilder.withLoggerMiddleware'", () => {
        expect(clientBuilder.withLoggerMiddleware).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.withClientCredentialsFlow'", () => {
        expect(clientBuilder.withClientCredentialsFlow).toHaveBeenCalledWith(
          options.auth,
        );
      });

      test("should call 'clientBuilder.build'", () => {
        expect(clientBuilder.build).toHaveBeenCalled();
      });

      test("should call 'createApiBuilderFromCtpClient'", () => {
        expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith({
          id: 'client',
        });
      });

      test("should call 'apiRoot.withProjectKey'", () => {
        expect(apiRoot.withProjectKey).toHaveBeenCalledWith({
          projectKey: options.projectKey,
        });
      });

      test('shuould return apiroot.withProjectKey result', () => {
        expect(byProjectKeyRequestBuilder).toEqual({
          id: 'byProjectKeyRequestBuilder',
        });
      });
    });

    describe('when fetch not provided', () => {
      beforeAll(() => {
        options = {
          auth: {
            host: 'https://auth.commercetools.co',
            projectKey: 'projectKey',
            credentials: {
              clientId: 'clientId',
              clientSecret: 'clientSecret',
            },
          },
          http: {
            host: 'https://api.commercetools.co',
            enableRetry: true,
            retryConfig: {
              maxRetries: 3,
            },
          },
          projectKey: 'projectKey',
        };
      });

      beforeEach(() => {
        byProjectKeyRequestBuilder = getByProjectKeyRequestBuilder(options);
      });

      test("should call 'clientBuilder.withProjectKey'", () => {
        expect(clientBuilder.withProjectKey).toHaveBeenCalledWith(
          options.projectKey,
        );
      });

      test("should call 'clientBuilder.withHttpMiddleware'", () => {
        expect(clientBuilder.withHttpMiddleware).toHaveBeenCalledWith({
          ...options.http,
          fetch,
        });
      });

      test("should not call 'clientBuilder.withLoggerMiddleware'", () => {
        expect(clientBuilder.withLoggerMiddleware).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.withClientCredentialsFlow'", () => {
        expect(clientBuilder.withClientCredentialsFlow).toHaveBeenCalledWith({
          ...options.auth,
          fetch,
        });
      });

      test("should call 'clientBuilder.build'", () => {
        expect(clientBuilder.build).toHaveBeenCalled();
      });

      test("should call 'createApiBuilderFromCtpClient'", () => {
        expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith({
          id: 'client',
        });
      });

      test("should call 'apiRoot.withProjectKey'", () => {
        expect(apiRoot.withProjectKey).toHaveBeenCalledWith({
          projectKey: options.projectKey,
        });
      });

      test('shuould return apiroot.withProjectKey result', () => {
        expect(byProjectKeyRequestBuilder).toEqual({
          id: 'byProjectKeyRequestBuilder',
        });
      });
    });
  });

  describe('when logger provided', () => {
    describe('when fetch provided', () => {
      beforeAll(() => {
        options = {
          http: {
            host: 'https://api.commercetools.co',
            enableRetry: true,
            retryConfig: {
              maxRetries: 3,
            },
            fetch: customFetch,
          },
          logger: true,
          projectKey: 'projectKey',
        };
      });

      beforeEach(() => {
        byProjectKeyRequestBuilder = getByProjectKeyRequestBuilder(options);
      });

      test("should call 'clientBuilder.withProjectKey'", () => {
        expect(clientBuilder.withProjectKey).toHaveBeenCalledWith(
          options.projectKey,
        );
      });

      test("should call 'clientBuilder.withHttpMiddleware'", () => {
        expect(clientBuilder.withHttpMiddleware).toHaveBeenCalledWith(
          options.http,
        );
      });

      test("should call 'clientBuilder.withLoggerMiddleware'", () => {
        expect(clientBuilder.withLoggerMiddleware).toHaveBeenCalled();
      });

      test("should not call 'clientBuilder.withClientCredentialsFlow'", () => {
        expect(clientBuilder.withClientCredentialsFlow).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.withMiddleware' once", () => {
        expect(clientBuilder.withMiddleware).toHaveBeenCalledTimes(1);
      });

      test("should not call 'clientBuilder.withQueueMiddleware'", () => {
        expect(clientBuilder.withQueueMiddleware).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.build'", () => {
        expect(clientBuilder.build).toHaveBeenCalled();
      });

      test("should call 'createApiBuilderFromCtpClient'", () => {
        expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith({
          id: 'client',
        });
      });

      test("should call 'apiRoot.withProjectKey'", () => {
        expect(apiRoot.withProjectKey).toHaveBeenCalledWith({
          projectKey: options.projectKey,
        });
      });

      test('shuould return apiroot.withProjectKey result', () => {
        expect(byProjectKeyRequestBuilder).toEqual({
          id: 'byProjectKeyRequestBuilder',
        });
      });
    });

    describe('when fetch not provided', () => {
      beforeAll(() => {
        options = {
          http: {
            host: 'https://api.commercetools.co',
            enableRetry: true,
            retryConfig: {
              maxRetries: 3,
            },
          },
          logger: true,
          projectKey: 'projectKey',
        };
      });

      beforeEach(() => {
        byProjectKeyRequestBuilder = getByProjectKeyRequestBuilder(options);
      });

      test("should call 'clientBuilder.withProjectKey'", () => {
        expect(clientBuilder.withProjectKey).toHaveBeenCalledWith(
          options.projectKey,
        );
      });

      test("should call 'clientBuilder.withHttpMiddleware'", () => {
        expect(clientBuilder.withHttpMiddleware).toHaveBeenCalledWith({
          ...options.http,
          fetch,
        });
      });

      test("should call 'clientBuilder.withLoggerMiddleware'", () => {
        expect(clientBuilder.withLoggerMiddleware).toHaveBeenCalled();
      });

      test("should not call 'clientBuilder.withClientCredentialsFlow'", () => {
        expect(clientBuilder.withClientCredentialsFlow).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.withMiddleware' once", () => {
        expect(clientBuilder.withMiddleware).toHaveBeenCalledTimes(1);
      });

      test("should not call 'clientBuilder.withQueueMiddleware'", () => {
        expect(clientBuilder.withQueueMiddleware).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.build'", () => {
        expect(clientBuilder.build).toHaveBeenCalled();
      });

      test("should call 'createApiBuilderFromCtpClient'", () => {
        expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith({
          id: 'client',
        });
      });

      test("should call 'apiRoot.withProjectKey'", () => {
        expect(apiRoot.withProjectKey).toHaveBeenCalledWith({
          projectKey: options.projectKey,
        });
      });

      test('shuould return apiroot.withProjectKey result', () => {
        expect(byProjectKeyRequestBuilder).toEqual({
          id: 'byProjectKeyRequestBuilder',
        });
      });
    });
  });

  describe('when middleware provided', () => {
    beforeAll(() => {
      options = {
        http: {
          host: 'https://api.commercetools.co',
          enableRetry: true,
          retryConfig: {
            maxRetries: 3,
          },
        },
        middleware: (next: Dispatch) => next,
        projectKey: 'projectKey',
      };
    });

    beforeEach(() => {
      byProjectKeyRequestBuilder = getByProjectKeyRequestBuilder(options);
    });

    test("should call 'clientBuilder.withProjectKey'", () => {
      expect(clientBuilder.withProjectKey).toHaveBeenCalledWith(
        options.projectKey,
      );
    });

    test("should call 'clientBuilder.withHttpMiddleware'", () => {
      expect(clientBuilder.withHttpMiddleware).toHaveBeenCalledWith({
        ...options.http,
        fetch,
      });
    });

    test("should not call 'clientBuilder.withLoggerMiddleware'", () => {
      expect(clientBuilder.withLoggerMiddleware).not.toHaveBeenCalled();
    });

    test("should call 'clientBuilder.withMiddleware' twice", () => {
      expect(clientBuilder.withMiddleware).toHaveBeenCalledTimes(2);
      expect(clientBuilder.withMiddleware).toHaveBeenNthCalledWith(
        2,
        options.middleware,
      );
    });

    test("should call 'clientBuilder.build'", () => {
      expect(clientBuilder.build).toHaveBeenCalled();
    });

    test("should call 'createApiBuilderFromCtpClient'", () => {
      expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith({
        id: 'client',
      });
    });

    test("should call 'apiRoot.withProjectKey'", () => {
      expect(apiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: options.projectKey,
      });
    });

    test('shuould return apiroot.withProjectKey result', () => {
      expect(byProjectKeyRequestBuilder).toEqual({
        id: 'byProjectKeyRequestBuilder',
      });
    });
  });

  describe('when queue provided', () => {
    beforeAll(() => {
      options = {
        http: {
          host: 'https://api.commercetools.co',
          enableRetry: true,
          retryConfig: {
            maxRetries: 3,
          },
        },
        queue: { concurrency: 10 },
        projectKey: 'projectKey',
      };
    });

    beforeEach(() => {
      byProjectKeyRequestBuilder = getByProjectKeyRequestBuilder(options);
    });

    test("should call 'clientBuilder.withProjectKey'", () => {
      expect(clientBuilder.withProjectKey).toHaveBeenCalledWith(
        options.projectKey,
      );
    });

    test("should call 'clientBuilder.withHttpMiddleware'", () => {
      expect(clientBuilder.withHttpMiddleware).toHaveBeenCalledWith({
        ...options.http,
        fetch,
      });
    });

    test("should not call 'clientBuilder.withLoggerMiddleware'", () => {
      expect(clientBuilder.withLoggerMiddleware).not.toHaveBeenCalled();
    });

    test("should call 'clientBuilder.withQueueMiddleware'", () => {
      expect(clientBuilder.withQueueMiddleware).toHaveBeenCalledWith(
        options.queue,
      );
    });

    test("should call 'clientBuilder.build'", () => {
      expect(clientBuilder.build).toHaveBeenCalled();
    });

    test("should call 'createApiBuilderFromCtpClient'", () => {
      expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith({
        id: 'client',
      });
    });

    test("should call 'apiRoot.withProjectKey'", () => {
      expect(apiRoot.withProjectKey).toHaveBeenCalledWith({
        projectKey: options.projectKey,
      });
    });

    test('shuould return apiroot.withProjectKey result', () => {
      expect(byProjectKeyRequestBuilder).toEqual({
        id: 'byProjectKeyRequestBuilder',
      });
    });
  });

  describe('when only required properties', () => {
    describe('when fetch provided', () => {
      beforeAll(() => {
        options = {
          http: {
            host: 'https://api.commercetools.co',
            enableRetry: true,
            retryConfig: {
              maxRetries: 3,
            },
            fetch: customFetch,
          },
          projectKey: 'projectKey',
        };
      });

      beforeEach(() => {
        byProjectKeyRequestBuilder = getByProjectKeyRequestBuilder(options);
      });

      test("should call 'clientBuilder.withProjectKey'", () => {
        expect(clientBuilder.withProjectKey).toHaveBeenCalledWith(
          options.projectKey,
        );
      });

      test("should call 'clientBuilder.withHttpMiddleware'", () => {
        expect(clientBuilder.withHttpMiddleware).toHaveBeenCalledWith(
          options.http,
        );
      });

      test("should not call 'clientBuilder.withLoggerMiddleware'", () => {
        expect(clientBuilder.withLoggerMiddleware).not.toHaveBeenCalled();
      });

      test("should not call 'clientBuilder.withClientCredentialsFlow'", () => {
        expect(clientBuilder.withClientCredentialsFlow).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.withMiddleware' once", () => {
        expect(clientBuilder.withMiddleware).toHaveBeenCalledTimes(1);
      });

      test("should not call 'clientBuilder.withQueueMiddleware'", () => {
        expect(clientBuilder.withQueueMiddleware).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.build'", () => {
        expect(clientBuilder.build).toHaveBeenCalled();
      });

      test("should call 'createApiBuilderFromCtpClient'", () => {
        expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith({
          id: 'client',
        });
      });

      test("should call 'apiRoot.withProjectKey'", () => {
        expect(apiRoot.withProjectKey).toHaveBeenCalledWith({
          projectKey: options.projectKey,
        });
      });

      test('shuould return apiroot.withProjectKey result', () => {
        expect(byProjectKeyRequestBuilder).toEqual({
          id: 'byProjectKeyRequestBuilder',
        });
      });
    });

    describe('when fetch not provided', () => {
      beforeAll(() => {
        options = {
          http: {
            host: 'https://api.commercetools.co',
            enableRetry: true,
            retryConfig: {
              maxRetries: 3,
            },
          },
          projectKey: 'projectKey',
        };
      });

      beforeEach(() => {
        byProjectKeyRequestBuilder = getByProjectKeyRequestBuilder(options);
      });

      test("should call 'clientBuilder.withProjectKey'", () => {
        expect(clientBuilder.withProjectKey).toHaveBeenCalledWith(
          options.projectKey,
        );
      });

      test("should call 'clientBuilder.withHttpMiddleware'", () => {
        expect(clientBuilder.withHttpMiddleware).toHaveBeenCalledWith({
          ...options.http,
          fetch,
        });
      });

      test("should not call 'clientBuilder.withLoggerMiddleware'", () => {
        expect(clientBuilder.withLoggerMiddleware).not.toHaveBeenCalled();
      });

      test("should not call 'clientBuilder.withClientCredentialsFlow'", () => {
        expect(clientBuilder.withClientCredentialsFlow).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.withMiddleware' once", () => {
        expect(clientBuilder.withMiddleware).toHaveBeenCalledTimes(1);
      });

      test("should not call 'clientBuilder.withQueueMiddleware'", () => {
        expect(clientBuilder.withQueueMiddleware).not.toHaveBeenCalled();
      });

      test("should call 'clientBuilder.build'", () => {
        expect(clientBuilder.build).toHaveBeenCalled();
      });

      test("should call 'createApiBuilderFromCtpClient'", () => {
        expect(createApiBuilderFromCtpClient).toHaveBeenCalledWith({
          id: 'client',
        });
      });

      test("should call 'apiRoot.withProjectKey'", () => {
        expect(apiRoot.withProjectKey).toHaveBeenCalledWith({
          projectKey: options.projectKey,
        });
      });

      test('shuould return apiroot.withProjectKey result', () => {
        expect(byProjectKeyRequestBuilder).toEqual({
          id: 'byProjectKeyRequestBuilder',
        });
      });
    });
  });
});

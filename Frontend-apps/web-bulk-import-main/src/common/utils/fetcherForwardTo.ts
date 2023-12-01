/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import { TFetcherResponse } from '@commercetools-frontend/application-shell/dist/declarations/src/utils/http-client';
import createHttpUserAgent from '@commercetools/http-user-agent';
import axios from 'axios';

interface IFetcherReturn {
  data: any;
  statusCode: number;
  getHeader: Function;
}

const userAgent = createHttpUserAgent({
  name: 'axios-client',
  version: '1.4.0',
  libraryName: (window as any).app.applicationName,
  contactEmail: 'support@my-company.com',
});

export const fetcherForwardTo = async (
  targetUrl: string,
  request: FormData
): Promise<IFetcherReturn> => {
  let responseData = {} as IFetcherReturn;
  await executeHttpClientRequest(
    async (options) => {
      const res = await axios(buildApiUrl('/proxy/forward-to'), {
        ...options,
        method: 'post',
        data: request,
        headers: {
          ...options.headers,
        },
        withCredentials: options.credentials === 'include',
      });
      const data = res.data;
      const response = {
        data,
        statusCode: res.status,
        getHeader: (key: any) => res.headers[key],
      } as unknown as TFetcherResponse<any>;
      responseData = response;
      return response;
    },
    {
      userAgent,
      forwardToConfig: {
        uri: targetUrl,
      },
    }
  );
  return responseData;
};

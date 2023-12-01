/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axios from 'axios';

import type { IResponse } from './response.interface';

import { handlerError } from './handler-error';
import { handleSuccess } from './handler-success';

class HttpService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BFF_CREDIT_EVALUATION_REQUEST,
    });
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<IResponse<T>> {
    try {
      const response = await this.axiosInstance.get<IResponse<T>>(url, config);
      return handleSuccess<T>(response);
    } catch (error: any) {
      const { data } = error.response;
      const message = data?.Error ?? data.message;
      return handlerError({ ...error, message } as AxiosError);
    }
  }

  public async post<T, K>(
    route: string,
    payload: K,
    config?: AxiosRequestConfig
  ): Promise<IResponse<T>> {
    try {
      const response = await this.axiosInstance.post<IResponse<T>>(
        route,
        payload,
        config
      );
      return handleSuccess<T>(response);
    } catch (error: any) {
      const message = error.response.data?.Error ?? error.response.data.message;
      return handlerError({ ...error, message } as AxiosError);
    }
  }

  public async put<T, K>(
    url: string,
    data: K,
    config?: AxiosRequestConfig
  ): Promise<IResponse<T>> {
    try {
      const response = await this.axiosInstance.put(url, data, config);

      return handleSuccess<T>(response);
    } catch (error: any) {
      const message = error.response.data?.Error ?? error.response.data.message;
      return handlerError({ ...error, message } as AxiosError);
    }
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<IResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(url, config);
      return handleSuccess<T>(response);
    } catch (error: any) {
      const message = error.response.data?.Error ?? error.response.data.message;
      return handlerError({ ...error, message } as AxiosError);
    }
  }

  public async patch<T, K>(
    route: string,
    payload: K,
    config?: AxiosRequestConfig
  ): Promise<IResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<IResponse<T>>(
        route,
        payload,
        config
      );
      return handleSuccess<T>(response);
    } catch (error: any) {
      const message = error.response.data?.Error ?? error.response.data.message;
      return handlerError({ ...error, message } as AxiosError);
    }
  }
}
export default HttpService;

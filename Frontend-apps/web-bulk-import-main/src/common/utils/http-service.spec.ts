/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HttpService from './http-service';

const mockAxios = new MockAdapter(axios);

describe('HttpService', () => {
  let httpService: HttpService;

  beforeEach(() => {
    httpService = new HttpService();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should handle a successful GET request', async () => {
    const expectedResponse = {
      statusCode: 200,
      payload: undefined,
      data: {
        id: 123,
        name: 'John Doe',
      },
    };

    const url = 'https://api.example.com/data';

    mockAxios.onGet(url).reply(200, expectedResponse.data);

    const response = await httpService.get(url);

    expect(response).toEqual(expectedResponse);
  });

  it('should handle a failed GET request', async () => {
    const errorMessage = 'Error in the request';
    const errorData = {
      message: 'Error in the request',
      statusCode: 500,
    };

    const url = 'https://api.example.com/data';
    mockAxios.onGet(url).reply(500, errorData);

    const response = await httpService.get(url);

    expect(response.statusCode).toBe(500);
    expect(response.message).toBe(errorMessage);
  });

  it('should handle a successful POST request', async () => {
    const payload = { name: 'John Doe' };
    const expectedResponse = {
      statusCode: 201,
      payload: undefined,
      data: { id: 123, name: 'John Doe' },
    };

    const route = 'https://api.example.com/data';
    mockAxios.onPost(route).reply(201, expectedResponse.data);

    const response = await httpService.post<any, typeof payload>(
      route,
      payload
    );

    expect(response).toEqual(expectedResponse);
  });

  it('should handle a failed POST request', async () => {
    const payload = { name: 'John Doe' };
    const errorMessage = 'Error in the request';
    const errorData = {
      message: 'Error in the request',
      statusCode: 500,
    };

    const route = 'https://api.example.com/data';
    mockAxios.onPost(route).reply(500, errorData);

    const response = await httpService.post<any, typeof payload>(
      route,
      payload
    );

    expect(response.statusCode).toBe(500);
    expect(response.message).toBe(errorMessage);
  });

  it('should handle a successful PUT request', async () => {
    const data = { id: 123, name: 'John Doe' };
    const expectedResponse = {
      statusCode: 200,
      payload: undefined,
      data,
    };

    const url = 'https://api.example.com/data/123';
    mockAxios.onPut(url).reply(200, expectedResponse.data);

    const response = await httpService.put<any, typeof data>(url, data);

    expect(response).toEqual(expectedResponse);
  });

  it('should handle a failed PUT request', async () => {
    const data = { id: 123, name: 'John Doe' };
    const errorMessage = 'Error in the request';
    const errorData = {
      message: 'Error in the request',
      statusCode: 500,
    };

    const url = 'https://api.example.com/data/123';
    mockAxios.onPut(url).reply(500, errorData);

    const response = await httpService.put<any, typeof data>(url, data);

    expect(response.statusCode).toBe(500);
    expect(response.message).toBe(errorMessage);
  });

  it('should handle a successful DELETE request', async () => {
    const data = { id: 123, name: 'John Doe' };
    const expectedResponse = {
      statusCode: 200,
      payload: undefined,
      data,
    };

    const url = 'https://api.example.com/data/123';
    mockAxios.onDelete(url).reply(200, expectedResponse.data);

    const response = await httpService.delete<any>(url);

    expect(response).toEqual(expectedResponse);
  });

  it('should handle a failed DELETE request', async () => {
    const errorMessage = 'Error in the request';
    const errorData = {
      message: 'Error in the request',
      statusCode: 500,
    };

    const url = 'https://api.example.com/data/123';
    mockAxios.onDelete(url).reply(500, errorData);

    const response = await httpService.delete(url);

    expect(response.message).toBe(errorMessage);
  });

  it('should handle a successful PATCH request', async () => {
    const data = { id: 123, name: 'John Doe' };
    const expectedResponse = {
      statusCode: 200,
      payload: undefined,
      data,
    };

    const url = 'https://api.example.com/data/123';
    mockAxios.onPatch(url).reply(200, expectedResponse.data);

    const response = await httpService.patch<any, typeof data>(url, data);

    expect(response).toEqual(expectedResponse);
  });

  it('should handle a failed PATCH request', async () => {
    const requestData = { id: 123, name: 'John Doe' };
    const errorMessage = 'Error in the request';
    const errorData = {
      message: 'Error in the request',
      statusCode: 500,
    };

    // Configurar el mock para simular una respuesta de error
    const url = 'https://api.example.com/data/123';
    mockAxios.onPatch(url).reply(500, errorData);

    // Realizar la llamada al método patch

    const response = await httpService.patch<
      typeof requestData,
      typeof requestData
    >(url, requestData);

    // Verificar que la solicitud lanzó una excepción con el mensaje de error
    expect(response.message).toBe(errorMessage);
  });
});

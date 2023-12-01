import axios from '@/utils/axiosInstance';
import { createZone, editZone, getZones, removeZone } from './Zones';
import { SALES_BASE_URL } from '../config';
import { toQueryParams } from '@/utils/Request';

jest.mock('@/utils/axiosInstance');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Zones API', () => {
  const BASE_URL = `${SALES_BASE_URL}/zones`;
  describe('getZones', () => {
    it('fetches successfully data from an API', async () => {
      const data = {
        data: {
          count: 0,
          total: 0,
          limit: 0,
          offset: 0,
          results: []
        }
      };

      mockedAxios.get.mockResolvedValue(data);

      const result = await getZones(toQueryParams({ offset: 0, limit: 10 }));
      expect(result).toEqual(data.data);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${BASE_URL}?offset=0&limit=10`
      );
    });

    it('fetches erroneously data from an API', async () => {
      const mockedError = {
        response: {
          data: {
            statusCode: 500,
            statusText: 'Server Error'
          }
        }
      };
      mockedAxios.get.mockImplementationOnce(() => Promise.reject(mockedError));

      try {
        await getZones(toQueryParams({ offset: 0, limit: 10 }));
      } catch (e) {
        expect(e).toStrictEqual(mockedError.response.data);
      }
    });
  });

  describe('createZone', () => {
    const payload = {
      name: 'zone manager',
      zoneManagerId: 'manager@mail.com'
    };
    it('creates a zone', async () => {
      const zone = 28;
      const mockedResult = {
        data: {
          id: zone,
          ...payload
        }
      };
      mockedAxios.post.mockResolvedValue(mockedResult);
      const result = await createZone(payload);
      expect(result).toEqual(mockedResult.data);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}`, payload);
    });

    it('catch an error', async () => {
      const mockedError = {
        response: {
          data: {
            statusCode: 500,
            statusText: 'Server Error'
          }
        }
      };
      mockedAxios.post.mockImplementationOnce(() =>
        Promise.reject(mockedError)
      );

      try {
        await createZone(payload);
      } catch (e) {
        expect(e).toStrictEqual(mockedError.response.data);
      }
    });
  });

  describe('editZone', () => {
    const zoneId = 39;
    const payload = {
      name: 'zone manager',
      zoneManagerId: 'manager@mail.com'
    };
    it('edits a zone', async () => {
      const mockedResult = {
        data: {
          id: zoneId,
          ...payload
        }
      };
      mockedAxios.put.mockResolvedValue(mockedResult);
      const result = await editZone({ payload, id: zoneId });
      expect(result).toEqual(mockedResult.data);
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${BASE_URL}/${zoneId}`,
        payload
      );
    });

    it('catch an error', async () => {
      const mockedError = {
        response: {
          data: {
            statusCode: 500,
            statusText: 'Server Error'
          }
        }
      };
      mockedAxios.put.mockImplementationOnce(() => Promise.reject(mockedError));

      try {
        await editZone({ payload, id: zoneId });
      } catch (e) {
        expect(e).toStrictEqual(mockedError.response.data);
      }
    });
  });

  describe('removeZone', () => {
    const zoneId = 1;
    it('removes a zone', async () => {
      const mockedResult = {
        data: {
          id: zoneId
        }
      };
      mockedAxios.delete.mockResolvedValue(mockedResult);
      const result = await removeZone(zoneId);
      expect(result).toEqual(mockedResult.data);
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${BASE_URL}/${zoneId}`);
    });

    it('catch an error', async () => {
      const mockedError = {
        response: {
          data: {
            statusCode: 500,
            statusText: 'Server Error'
          }
        }
      };
      mockedAxios.delete.mockImplementationOnce(() =>
        Promise.reject(mockedError)
      );

      try {
        await removeZone(zoneId);
      } catch (e) {
        expect(e).toStrictEqual(mockedError.response.data);
      }
    });
  });
});

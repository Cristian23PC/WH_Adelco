import axios from '@/utils/axiosInstance';
import {
  getTerritories,
  createTerritory,
  editTerritory,
  removeTerritory
} from './Territory';
import { SALES_BASE_URL } from '../config';
import { toQueryParams } from '@/utils/Request';

jest.mock('@/utils/axiosInstance');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Territory API', () => {
  const BASE_URL = `${SALES_BASE_URL}/territories`;
  describe('getTerritories', () => {
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

      const result = await getTerritories(
        toQueryParams({ offset: 0, limit: 10 })
      );
      expect(result).toEqual(data.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${BASE_URL}?offset=0&limit=10`
      );
    });

    it('fetches erroneously data from an API', async () => {
      const errorMessage = 'Network Error';

      mockedAxios.get.mockImplementationOnce(() =>
        Promise.reject({ response: { data: errorMessage } })
      );

      try {
        await getTerritories(toQueryParams({ offset: 0, limit: 10 }));
      } catch (e) {
        expect(e).toBe(errorMessage);
      }
    });
  });

  describe('createTerritory', () => {
    const payload = {
      externalId: '123',
      name: 'Some create test',
      supervisedAreaId: 1,
      salesRepId: 'johndoe@test.test',
      description: 'some description'
    };
    it('creates a territory', async () => {
      const territoryId = 28;
      const mockedResult = {
        data: {
          id: territoryId,
          ...payload
        }
      };
      mockedAxios.post.mockResolvedValue(mockedResult);
      const result = await createTerritory(payload);
      expect(result).toEqual(mockedResult.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}`, payload);
    });
    it('catch an error', async () => {
      const mockedError = {
        isAxiosError: true,
        response: {
          status: 500,
          statusText: 'Server Error'
        },
        message: 'something went wrong.'
      };
      mockedAxios.post.mockImplementationOnce(() =>
        Promise.reject(mockedError)
      );
      const response = await createTerritory(payload);
      expect(response).toEqual(mockedError);
    });
  });

  describe('editTerritory', () => {
    const territoryId = 39;
    const payload = {
      name: 'territory test',
      supervisedAreaId: 1,
      salesRepId: 'johndoe@test.test',
      description: 'new description'
    };
    it('it successfully edits a territory', async () => {
      const mockedResult = {
        data: {
          id: territoryId,
          externalId: '123',
          ...payload
        }
      };
      mockedAxios.put.mockResolvedValue(mockedResult);
      const result = await editTerritory({ payload, id: territoryId });
      expect(result).toEqual(mockedResult.data);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${BASE_URL}/${territoryId}`,
        payload
      );
    });
    it('catch an error', async () => {
      const mockedError = {
        isAxiosError: true,
        response: {
          status: 500,
          statusText: 'Server Error'
        },
        message: 'something went wrong.'
      };
      mockedAxios.put.mockImplementationOnce(() => Promise.reject(mockedError));
      const response = await editTerritory({ payload, id: territoryId });
      expect(response).toEqual(mockedError);
    });
  });

  describe('removeTerritory', () => {
    it('removes a territory', async () => {
      const id = 23;
      const mockResult = {
        data: {
          id,
          name: 'some removed test'
        }
      };
      mockedAxios.delete.mockResolvedValue(mockResult);
      const result = await removeTerritory(id);
      expect(result).toEqual(mockResult.data);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${BASE_URL}/${id}`);
    });
  });
});

import axios from '@/utils/axiosInstance';
import {
  getBUSalesProfiles,
  assignBUSalesProfileTerritory
} from './BUSalesProfile';
import { SALES_BASE_URL } from '../config';
import { toQueryParams } from '@/utils/Request';

jest.mock('@/utils/axiosInstance');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BUSalesProfiles', () => {
  const BASE_URL = `${SALES_BASE_URL}/bu-sales-profile`;
  describe('getBUSalesProfiles', () => {
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

      const result = await getBUSalesProfiles(
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
        await getBUSalesProfiles(toQueryParams({ offset: 0, limit: 10 }));
      } catch (e) {
        expect(e).toBe(errorMessage);
      }
    });
  });

  describe('assignTerritory', () => {
    const territoryId = 123;
    const id = 45;
    it('should assign a territory', async () => {
      const mockedResult = {
        data: {
          id,
          name: 'client test',
          territoryId
        }
      };
      mockedAxios.patch.mockResolvedValue(mockedResult);
      const result = await assignBUSalesProfileTerritory({ id, territoryId });
      expect(result).toEqual(mockedResult.data);
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${BASE_URL}/${id}/territory`,
        { territoryId }
      );
    });
    it('should return axios error', async () => {
      const mockedError = 'Server Error';
      mockedAxios.patch.mockImplementationOnce(() =>
        Promise.reject({ response: { data: mockedError } })
      );

      try {
        await assignBUSalesProfileTerritory({ id, territoryId });
      } catch (e) {
        expect(e).toBe(mockedError);
      }
    });
  });
});

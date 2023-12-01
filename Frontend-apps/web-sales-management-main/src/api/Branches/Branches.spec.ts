import axios from '@/utils/axiosInstance';
import {
  createBranch,
  editBranch,
  getBranches,
  removeBranch
} from './Branches';
import { SALES_BASE_URL } from '../config';
import { toQueryParams } from '@/utils/Request';

jest.mock('@/utils/axiosInstance');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Branches API', () => {
  const BASE_URL = `${SALES_BASE_URL}/branches`;
  describe('getBranches', () => {
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

      const result = await getBranches(toQueryParams({ offset: 0, limit: 10 }));
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
        await getBranches(toQueryParams({ offset: 0, limit: 10 }));
      } catch (e) {
        expect(e).toStrictEqual(mockedError.response.data);
      }
    });
  });

  describe('createBranch', () => {
    const payload = {
      name: 'branch name',
      zoneId: 12,
      code: '0010'
    };
    it('creates a branch', async () => {
      const branchId = 28;
      const mockedResult = {
        data: {
          id: branchId,
          ...payload
        }
      };
      mockedAxios.post.mockResolvedValue(mockedResult);
      const result = await createBranch(payload);
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
        await createBranch(payload);
      } catch (e) {
        expect(e).toStrictEqual(mockedError.response.data);
      }
    });
  });

  describe('editBranch', () => {
    const branchId = 39;
    const payload = {
      name: 'branch name',
      zoneId: 12,
      code: '0010'
    };
    it('edits a branch', async () => {
      const mockedResult = {
        data: {
          id: branchId,
          ...payload
        }
      };
      mockedAxios.put.mockResolvedValue(mockedResult);
      const result = await editBranch({ payload, id: branchId });
      expect(result).toEqual(mockedResult.data);
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${BASE_URL}/${branchId}`,
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
        await editBranch({ payload, id: branchId });
      } catch (e) {
        expect(e).toStrictEqual(mockedError.response.data);
      }
    });
  });

  describe('removeBranch', () => {
    const branchId = 1;
    it('removes a branch', async () => {
      const mockedResult = {
        data: {
          id: branchId
        }
      };
      mockedAxios.delete.mockResolvedValue(mockedResult);
      const result = await removeBranch(branchId);
      expect(result).toEqual(mockedResult.data);
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${BASE_URL}/${branchId}`
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
      mockedAxios.delete.mockImplementationOnce(() =>
        Promise.reject(mockedError)
      );

      try {
        await removeBranch(branchId);
      } catch (e) {
        expect(e).toStrictEqual(mockedError.response.data);
      }
    });
  });
});

import axios from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { SALES_BASE_URL } from '../config';
import { Branch, BranchPayload } from '@/types/Branch';

const BASE_URL = `${SALES_BASE_URL}/branches`;

export const getBranches = async (queryParams: string) => {
  try {
    const { data } = await axios.get(`${BASE_URL}${queryParams}`);

    return data;
  } catch (e) {
    throw (e as AxiosError).response?.data;
  }
};

export const createBranch = async (payload: BranchPayload): Promise<Branch> => {
  try {
    const { data } = await axios.post(`${BASE_URL}`, payload);
    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

export const editBranch = async ({
  payload,
  id
}: {
  payload: BranchPayload;
  id: number;
}): Promise<Branch> => {
  try {
    const { data } = await axios.put(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

export const removeBranch = async (id: number): Promise<Branch> => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/${id}`);
    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

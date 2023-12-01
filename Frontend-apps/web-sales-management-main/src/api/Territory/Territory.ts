import { AxiosError } from 'axios';
import axios from '@/utils/axiosInstance';
import { SALES_BASE_URL } from '../config';
import {
  TerritoriesPageResultResponse,
  type Territory,
  type TerritoryPayload
} from '@/types/Territory';

const BASE_URL = `${SALES_BASE_URL}/territories`;

export const getTerritories = async (
  queryParams: string
): Promise<TerritoriesPageResultResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}${queryParams}`);
    return data;
  } catch (e) {
    throw (e as AxiosError).response?.data;
  }
};

export const createTerritory = async (
  payload: TerritoryPayload
): Promise<Territory | AxiosError> => {
  try {
    const { data } = await axios.post(`${BASE_URL}`, payload);
    return data;
  } catch (error) {
    return error as AxiosError;
  }
};

export const editTerritory = async ({
  payload,
  id
}: {
  payload: TerritoryPayload;
  id: number;
}): Promise<Territory | AxiosError> => {
  try {
    const { data } = await axios.put(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (error) {
    return error as AxiosError;
  }
};

export const removeTerritory = async (id: number): Promise<Territory> => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`);

  return data;
};

import axios from '@/utils/axiosInstance';
import { SALES_BASE_URL } from '../config';
import {
  SupervisedAreaDraft,
  SupervisedAreasPageResultResponse
} from '@/types/SupervisedAreas';
import { AxiosError } from 'axios';

const BASE_URL = `${SALES_BASE_URL}/supervised-areas`;

export const getSupervisedAreas = async (
  queryParams: string
): Promise<SupervisedAreasPageResultResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}${queryParams}`);

    return data;
  } catch (e) {
    throw (e as AxiosError).response?.data;
  }
};

export const updateSupervisedArea = async ({
  id,
  branchId,
  ...supervisedAreaDraft
}: SupervisedAreaDraft & { id: number }) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/${id}`, {
      ...supervisedAreaDraft,
      branchId: Number(branchId)
    });

    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

export const createSupervisedArea = async ({
  branchId,
  ...supervisedAreaDraft
}: SupervisedAreaDraft) => {
  try {
    const { data } = await axios.post(BASE_URL, {
      ...supervisedAreaDraft,
      branchId: Number(branchId)
    });

    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

export const removeSupervisedArea = async (id: number) => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/${id}`);

    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

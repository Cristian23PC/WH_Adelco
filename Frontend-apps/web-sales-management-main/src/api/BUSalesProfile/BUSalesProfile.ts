import { AxiosError } from 'axios';
import axios from '@/utils/axiosInstance';
import { SALES_BASE_URL } from '../config';
import {
  BUSalesProfile,
  BUSalesProfilePageResultResponse,
  NextVisit,
  NextVisitPageResult,
  VisitSchedule
} from '@/types/BUSalesProfile';

const BASE_URL = `${SALES_BASE_URL}/bu-sales-profile`;

export const getBUSalesProfiles = async (
  queryParams: string
): Promise<BUSalesProfilePageResultResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}${queryParams}`);
    return data;
  } catch (e) {
    throw (e as AxiosError).response?.data;
  }
};

export const assignBUSalesProfileTerritory = async ({
  id,
  territoryId
}: {
  id: number;
  territoryId?: number;
}): Promise<BUSalesProfile | AxiosError> => {
  try {
    const { data } = await axios.patch(`${BASE_URL}/${id}/territory`, {
      territoryId
    });
    return data;
  } catch (error) {
    return error as AxiosError;
  }
};

export const setVisitSchedule = async ({
  id,
  payload
}: {
  id: number;
  payload: VisitSchedule;
}): Promise<BUSalesProfilePageResultResponse | AxiosError> => {
  try {
    const { data } = await axios.patch(
      `${BASE_URL}/${id}/visit-schedule`,
      payload
    );
    return data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};

export const getBUNextVisits = async (
  queryParams: string
): Promise<NextVisitPageResult> => {
  try {
    const { data } = await axios.get(
      `${SALES_BASE_URL}/bu-next-visits${queryParams}`
    );
    return data;
  } catch (error) {
    throw (error as AxiosError).response?.data;
  }
};

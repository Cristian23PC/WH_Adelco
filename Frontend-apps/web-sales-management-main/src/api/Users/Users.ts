import axios from '@/utils/axiosInstance';
import { SALES_BASE_URL } from '../config';
import { User, UserPayload, UsersPageResult } from '@/types/User';
import { AxiosError } from 'axios';

const BASE_URL_ADMIN = `${SALES_BASE_URL}/admin/users`;
const BASE_URL = `${SALES_BASE_URL}/users`;

export const getUsersList = async (
  queryParams: string
): Promise<UsersPageResult> => {
  try {
    const { data } = await axios.get(`${BASE_URL_ADMIN}${queryParams}`);

    return data;
  } catch (e) {
    throw (e as AxiosError).response?.data;
  }
};

export const removeUser = async (
  userName: string
): Promise<UsersPageResult> => {
  const { data } = await axios.delete(`${BASE_URL_ADMIN}/${userName}`);

  return data;
};

export const getUsers = async (
  queryParams: string
): Promise<UsersPageResult> => {
  const { data } = await axios.get(`${BASE_URL}${queryParams}`);

  return data;
};

export const createUser = async (userPayload: UserPayload): Promise<User> => {
  try {
    const payLoad = userPayload;
    payLoad.reportsToId = userPayload.reportsTo?.username || null;

    const { data } = await axios.post(`${BASE_URL_ADMIN}`, payLoad);

    return data;
  } catch (e: any) {
    throw e?.response?.data?.message;
  }
};

export const updateUser = async ({
  username,
  ...userPayload
}: UserPayload): Promise<User> => {
  try {
    const payLoad = userPayload;
    payLoad.reportsToId = userPayload.reportsTo?.username || null;

    const { data } = await axios.put(`${BASE_URL_ADMIN}/${username}`, payLoad);
    return data;
  } catch (e: any) {
    throw e?.response?.data?.message;
  }
};

export const getRegisteredUser = async (): Promise<User> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/me`);

    return data;
  } catch (e: any) {
    throw e?.response?.data?.message;
  }
};

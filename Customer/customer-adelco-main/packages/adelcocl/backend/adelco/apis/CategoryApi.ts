import axios, { RequestData } from '../utils/axiosInstance';
import { ApiResponseType } from '../utils/Request';
import { PageResults } from '@Types/adelco/general';
import { CtCategoryExpanded } from '../types/categories';

export const findCategories = async (
  requestData: RequestData,
  queryParams?: string
): Promise<{ data: PageResults<CtCategoryExpanded>; sessionData: any }> => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<unknown, ApiResponseType<any>>(
    `${baseURL}/categories/${queryParams}`,
    { headers }
  );
  return { data, sessionData };
};

export const getCategories = async (
  requestData: RequestData,
  queryParams: string
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<unknown, ApiResponseType<any>>(
    `${baseURL}/categories/tree${queryParams}`,
    { headers }
  );

  return { data, sessionData };
};

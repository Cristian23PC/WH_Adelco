import { AxiosErrorData } from '@Types/adelco/general/AdelcoError';
import { Request, ActionContext, Response } from '@frontastic/extension-types';
import { convertActiveCartInOrderApi } from '../../apis/OrderApi';
import { getDataFromContext } from '../../utils/axiosInstance';

export const convertActiveCartInOrder = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'orders'
    );

    const body = JSON.parse(request?.body);
    const { businessUnitId } = request?.sessionData?.userAccount;
    const res = await convertActiveCartInOrderApi(
      requestData,
      businessUnitId,
      body
    );

    return {
      statusCode: 200,
      body: JSON.stringify(res)
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

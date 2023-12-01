import fetch from 'node-fetch';
import { CtBusinessUnits } from '../../types/businessUnit';

export const getMyBusinessUnit = async (baseURL: string, customerId: string): Promise<CtBusinessUnits> => {
  const response = await fetch(`${baseURL}/customers/me/business-units`, {
    headers: {
      'x-customer-id': customerId,
    },
  });
  return response.json();
};

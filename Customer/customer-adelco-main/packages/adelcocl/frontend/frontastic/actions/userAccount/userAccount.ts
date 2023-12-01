import { Zone, EmailPassword } from '@Types/adelco/user';
import useSWR, { mutate } from 'swr';
// eslint-disable-next-line import/no-unresolved
import { fetchApiHub, revalidateOptions } from 'frontastic';

const BASE_ACTION = '/action/userAccount';
const GET_USER_ACCOUNT_ACTION = `${BASE_ACTION}/getUserAccount`;
const SET_ZONE_ACTION = `${BASE_ACTION}/setZone`;
const LOGIN_ACTION = `${BASE_ACTION}/login`;
const LOGOUT_ACTION = `${BASE_ACTION}/logout`;
const GET_USER_BUSINESS_ACCOUNT_ACTION = `${BASE_ACTION}/getUserBusinessAccount`;

export const getUserAccount = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useSWR(
    GET_USER_ACCOUNT_ACTION,
    fetchApiHub,
    revalidateOptions
  );

  return data;
};

export const getMyBusinessUnit = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useSWR(
    GET_USER_BUSINESS_ACCOUNT_ACTION,
    fetchApiHub,
    revalidateOptions
  );
  return data;
};

export const setZone = async (payload: Zone) => {
  const res = await fetchApiHub(
    SET_ZONE_ACTION,
    {
      method: 'POST'
    },
    payload
  );
  mutate(GET_USER_ACCOUNT_ACTION, res);
};

export const logout = async () => {
  const res = await fetchApiHub(LOGOUT_ACTION, { method: 'POST' });

  mutate(GET_USER_ACCOUNT_ACTION, res);
};

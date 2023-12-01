import { Zone, ZonePayload } from '@Types/adelco/user';
import { getToken } from '../../apis/KeyCloakApi';
import { getMyBusinessUnit } from '../../apis/CustomerApi';
import { Request, Response, ActionContext } from '@frontastic/extension-types';
import { formatZoneLabel } from '../../utils/mappers/businessUnit';
import { mapBussinessUnits } from '../../utils/mappers/customer';

const getUserAccountFromSession = (request: Request): Zone | undefined => {
  return request.sessionData?.userAccount;
};

export const getUserAccount = (request: Request): Response => {
  const userAccount = getUserAccountFromSession(request);

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount || {}),
  };
};

export const setZone = (request: Request): Response => {
  const { dch, t2z, communeLabel, regionLabel, deliveryZoneLabel } = JSON.parse(request.body) as ZonePayload;
  const userAccountSession = getUserAccountFromSession(request);
  const zoneLabel = formatZoneLabel({ communeLabel, regionLabel, deliveryZoneLabel });
  const userAccount = { ...userAccountSession, dch, t2z, zoneLabel };

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount),
    sessionData: {
      ...request.sessionData,
      userAccount,
    },
  };
};

// TODO: remove when can handle with errors
const email = 'test.4@mail.com';
const password = 'test123';
const dch = '72224a74-d7f5-4b93-943f-ea3c8f14ef99';
const t2z = 'cerrillos';
const businessUnitId = 'e3632193-e35e-452e-b56d-aa3f28d912fc';
// *************************************** //
export const login = async (request: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.businessUnit;
  const [tokenResponse, businessUnits] = await Promise.all([
    getToken({ email, password }),
    getMyBusinessUnit(baseURL, email),
  ]);
  const userAccountSession = getUserAccountFromSession(request);
  const zone = mapBussinessUnits(businessUnits);
  const userAccount = {
    ...userAccountSession,
    dch: zone?.dch || dch,
    t2z: zone?.t2z || t2z,
    businessUnitId: zone?.businessUnitId || businessUnitId,
    zoneLabel: zone.zoneLabel,
    loggedIn: true,
    ...(tokenResponse?.access_token && { access_token: tokenResponse.access_token }),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount),
    sessionData: {
      ...request.sessionData,
      userAccount,
    },
  };
};

export const logout = (request: Request): Response => {
  const userAccount = { loggedIn: false };

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount),
    sessionData: {
      ...request.sessionData,
      userAccount,
    },
  };
};

export const getUser = (request: Request): Response => {
  const userAccount = getUserAccountFromSession(request) || null;

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount),
  };
};

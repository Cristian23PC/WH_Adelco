import { getUserBusinessUnits } from '../../apis/BusinessUnitApi';
import { UnitType } from '../../types/businessUnit';
import { RequestData } from '../axiosInstance';

export const UNIT_TYPES: Record<string, UnitType> = {
  COMPANY: 'Company',
  DIVISION: 'Division'
} as const;

export const findBusinessUnitCompany = async (requestData: RequestData) => {
  const {
    data: { businessUnits },
    sessionData
  } = await getUserBusinessUnits(requestData);

  const businessUnitCompany = businessUnits?.find(
    ({ unitType }) => unitType === UNIT_TYPES.COMPANY
  );

  return { data: businessUnitCompany, sessionData };
};

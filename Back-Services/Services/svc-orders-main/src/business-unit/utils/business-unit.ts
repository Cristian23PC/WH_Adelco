import { COMPANY } from '@/business-unit/constants';

export const isCompany = (unitType: string): boolean => {
  return unitType === COMPANY;
};

import { SalesRep, Territory } from '@/types/Territory';
import { OptionObject } from '../../sales-entities/supervised-area/partials/SupervisedAreaForm/utils';

export const getSalesRepLabel = (salesRep?: SalesRep): string => {
  return salesRep?.firstName || salesRep?.lastName
    ? [salesRep?.firstName, salesRep?.lastName].join(' ')
    : '';
};

export const getDefaultSalesRepOptions = (
  territory?: Territory
): OptionObject[] => {
  if (!territory?.salesRep?.username) return [];
  const label = getSalesRepLabel(territory.salesRep);
  return [{ label, value: territory.salesRep.username }];
};

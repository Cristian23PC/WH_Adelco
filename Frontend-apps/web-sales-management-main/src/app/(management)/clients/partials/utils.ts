import { OptionObject } from '../../sales-entities/supervised-area/partials/SupervisedAreaForm/utils';
import { BUInfoType } from '../mockData';

export const getTerritoryLabel = (buInfo: BUInfoType): string => {
  return buInfo?.salesRepName || buInfo?.territoryName
    ? [buInfo.salesRepName, buInfo.territoryName].join(' / ')
    : '';
};

export const getDefaultTerritoryOptions = (
  buInfo?: BUInfoType
): OptionObject[] => {
  if (!buInfo) return [];
  return [
    {
      label: getTerritoryLabel(buInfo),
      value: '-'
    }
  ];
};

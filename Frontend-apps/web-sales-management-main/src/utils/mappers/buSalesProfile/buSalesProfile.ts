import { BUSalesProfile, BUSalesProfileResponse } from '@/types/BUSalesProfile';

const getFullName = (firstName?: string, lastName?: string) => {
  return [firstName, lastName].filter(Boolean).join(' ');
};

export const mapBUSalesProfile = (
  buSalesProfile: BUSalesProfileResponse
): BUSalesProfile => {
  const {
    id,
    name,
    territory,
    address,
    customerName,
    salesChannel,
    zoneManager,
    supervisor
  } = buSalesProfile;

  const salesRepName = getFullName(
    territory?.salesRep?.firstName,
    territory?.salesRep?.lastName
  );

  const zoneManagerName = getFullName(
    zoneManager?.firstName,
    zoneManager?.lastName
  );

  const supervisorName = getFullName(
    supervisor?.firstName,
    supervisor?.lastName
  );

  return {
    id,
    name,
    salesRepName,
    territoryName: territory?.name,
    schedule: buSalesProfile.schedule,
    address,
    channel: salesChannel || '',
    customerName,
    zoneManagerName,
    supervisorName
  };
};

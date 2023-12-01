import { DeliverZone } from '@Types/adelco/businessUnits';
import useImmutableSWR from 'swr/immutable';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

const KEY = '/action/businessUnits/getDeliveryZones';

const useDeliveryZones = (regionKey?: string, communeKey?: string) => {
  const { data } = useImmutableSWR<DeliverZone[]>(
    regionKey && communeKey ? [KEY, { regionKey, communeKey }] : undefined,
    ([url, payload]) =>
      fetchApiHub(url, { body: JSON.stringify(payload), method: 'POST' })
  );

  const sameCommuneAndDz = data?.length === 1 && data[0].commune === communeKey;

  return {
    deliveryZones: data || [],
    canShowDropdownDeliveryZones: !sameCommuneAndDz
  };
};

export default useDeliveryZones;

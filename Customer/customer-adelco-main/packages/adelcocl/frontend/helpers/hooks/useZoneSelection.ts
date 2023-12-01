import { useState } from 'react';
import { Values } from 'components/adelco/RegisterForm/useStep';
import useCommunes from 'frontastic/actions/adelco/businessUnit/useCommunes';
import useDeliveryZones from 'frontastic/actions/adelco/businessUnit/useDeliveryZones';
import useRegions from 'frontastic/actions/adelco/businessUnit/useRegions';

const defaultZoneSelection = {
  region: undefined,
  commune: undefined,
  locality: undefined
};

const useZoneSelection = () => {
  const [zoneSelection, setZoneSelection] =
    useState<Values>(defaultZoneSelection);
  const { regions } = useRegions();
  const { communes } = useCommunes(zoneSelection.region);
  const { deliveryZones } = useDeliveryZones(
    zoneSelection.region,
    zoneSelection.commune
  );

  const handleRegionChange = (value: string) => {
    setZoneSelection((zoneData) => ({
      ...zoneData,
      region: value
    }));
  };
  const handleCommuneChange = (value: string) => {
    setZoneSelection((zoneData) => ({
      ...zoneData,
      commune: value,
      locality: undefined
    }));
  };
  const handleLocalityChange = (value: string) => {
    setZoneSelection((zoneData) => ({
      ...zoneData,
      locality: value
    }));
  };

  return {
    regions,
    communes,
    deliveryZones,
    zoneSelection,
    handleRegionChange,
    handleCommuneChange,
    handleLocalityChange
  };
};

export default useZoneSelection;

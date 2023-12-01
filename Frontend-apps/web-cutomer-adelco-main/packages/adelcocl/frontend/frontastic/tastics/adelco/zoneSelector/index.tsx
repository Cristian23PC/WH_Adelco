import React, { useState, FC } from 'react';
import { useRouter } from 'next/router';
import { ZoneModal, toast } from 'am-ts-components';
import useCommunes from 'frontastic/actions/adelco/businessUnit/useCommunes';
import useDeliveryZones from 'frontastic/actions/adelco/businessUnit/useDeliveryZones';
import useRegions from 'frontastic/actions/adelco/businessUnit/useRegions';
import useSetZone from 'frontastic/actions/adelco/user/useSetZone';

type Props = {
  open?: boolean;
  onClose: VoidFunction;
};

type Values = {
  region?: string;
  commune?: string;
  locality?: string;
};

const ZoneSelector: FC<Props> = ({ open, onClose }) => {
  const router = useRouter();
  const [zoneSelection, setZoneSelection] = useState<Values>({
    region: undefined,
    commune: undefined,
    locality: undefined,
  });
  const { regions } = useRegions();
  const { communes } = useCommunes(zoneSelection.region);
  const { deliveryZones, canShowDropdownDeliveryZones } = useDeliveryZones(zoneSelection.region, zoneSelection.commune);
  const { trigger, isLoading } = useSetZone();

  const handleSubmitZoneSelection = async (data: Values) => {
    const t2z = data.locality || data.commune;
    const { label: regionLabel } = regions.find((reg) => reg.value === data.region) || {};
    const { label: communeLabel } = communes.find((com) => com.value === data.commune) || {};
    const { label: deliveryZoneLabel, dchDefault } = deliveryZones.find((dz) => dz.value === data.locality) || {};
    const dch = data.locality ? dchDefault : deliveryZones.find((opt) => opt.value == data.commune)?.dchDefault;

    if(dch === undefined) {
      return toast.error({
        title: 'Error',
        text: 'No hay datos para para la zona elegida.',
      });
    }

    await trigger({
      dch,
      t2z,
      regionLabel,
      communeLabel,
    });
    onClose();
    router.reload()
  };

  const handleRegionChange = (value: string) => {
    if (value !== zoneSelection.region) {
      setZoneSelection((prevState) => ({
        ...prevState,
        region: value,
        commune: undefined,
        locality: undefined,
      }));
    }
  };

  const handleCommuneChange = (value: string) => {
    if (value !== zoneSelection.commune) {
      setZoneSelection((prevState) => ({
        ...prevState,
        commune: value,
        locality: undefined,
      }));
    }
  };

  const handleLocalityChange = (value: string) => {
    if (value !== zoneSelection.locality) {
      setZoneSelection((prevState) => ({
        ...prevState,
        locality: value,
      }));
    }
  };

  return (
    <ZoneModal
      open={open}
      onClose={onClose}
      regionOptions={regions}
      onRegionChange={handleRegionChange}
      communeOptions={communes}
      onCommuneChange={handleCommuneChange}
      localityOptions={canShowDropdownDeliveryZones && deliveryZones}
      onLocalityChange={handleLocalityChange}
      onSubmit={handleSubmitZoneSelection}
      values={zoneSelection}
      isValid={Boolean(zoneSelection.region && zoneSelection.commune)}
      isLoading={isLoading}
    />
  );
};

export default ZoneSelector;

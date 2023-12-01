import React, { useState, FC } from 'react';
import { CartChangeZoneModal, ZoneModal, toast } from '@adelco/web-components';
import useCommunes from 'frontastic/actions/adelco/businessUnit/useCommunes';
import useDeliveryZones from 'frontastic/actions/adelco/businessUnit/useDeliveryZones';
import useRegions from 'frontastic/actions/adelco/businessUnit/useRegions';
import useSetZone from 'frontastic/actions/adelco/user/useSetZone';
import useTrackSelectLocation from 'helpers/hooks/analytics/useTrackSelectLocation';
import { labelizeText } from 'helpers/utils/formatLocaleName';
import useCart from 'frontastic/actions/adelco/cart/useCart';
import useEmptyCart from 'frontastic/actions/adelco/cart/useEmptyCart';
import { useModalContext } from 'contexts/modalContext';

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
  const { trackSelectLocation } = useTrackSelectLocation();
  const [zoneSelection, setZoneSelection] = useState<Values>({
    region: undefined,
    commune: undefined,
    locality: undefined
  });
  const { regions } = useRegions();
  const { communes } = useCommunes(zoneSelection.region);
  const { deliveryZones, canShowDropdownDeliveryZones } = useDeliveryZones(
    zoneSelection.region,
    zoneSelection.commune
  );
  const { trigger, isLoading } = useSetZone();
  const { openLoginModal } = useModalContext();
  const [currentZoneValues, setCurrentZoneValues] = useState<Values>(null);
  const [updateCartWarningOpen, setUpdateCartWarningOpen] = useState(false);
  const { cart } = useCart();
  const { trigger: emptyCart } = useEmptyCart();

  const handleCloseUpdateCartWarning = () => {
    setUpdateCartWarningOpen(false);
    setCurrentZoneValues(null);
  };

  const handleAcceptUpdateCartWarning = async () => {
    await handleSubmitZoneSelection(currentZoneValues);
    emptyCart();
    handleCloseUpdateCartWarning();
  };

  const handleShowCartWarning = (values: Values) => {
    setCurrentZoneValues(values);
    setUpdateCartWarningOpen(true);
    onClose();
  };

  const handleSubmitZoneSelection = async (data: Values) => {
    const t2z = data.locality || data.commune;
    const { label: regionLabel } =
      regions.find((reg) => reg.value === data.region) || {};

    const { label: communeLabel } =
      communes.find((com) => com.value === data.commune) || {};

    const { label: deliveryZoneLabel, dchDefault } =
      deliveryZones.find((dz) => dz.value === data.locality) || {};

    const dch = data.locality
      ? dchDefault
      : deliveryZones.find((opt) => opt.value == data.commune)?.dchDefault;

    const { id: zoneId, minimumOrderAmount: minAmount } =
      deliveryZones.find((dz) => dz.value === data.locality || data.commune) ||
      {};

    const location = {
      region: regionLabel,
      commune: communeLabel,
      locality: labelizeText(t2z)
    };

    if (dch === undefined) {
      trackSelectLocation(location, true);

      return toast.error({
        title: 'Error',
        text: 'No hay datos para la zona elegida.',
        iconName: 'error'
      });
    }

    try {
      await trigger({
        zoneId,
        dch,
        t2z,
        regionLabel,
        communeLabel,
        minAmount
      });

      trackSelectLocation(location);
    } catch {
      trackSelectLocation(location, true);
    }

    onClose();
  };

  const handleValidateSubmitZoneSelection = async (data: Values) => {
    const shouldShowCartWarning = cart?.lineItems?.length > 0;

    if (shouldShowCartWarning) {
      handleShowCartWarning(data);
    } else {
      await handleSubmitZoneSelection(data);
    }
  };

  const handleRegionChange = (value: string) => {
    if (value !== zoneSelection.region) {
      setZoneSelection((prevState) => ({
        ...prevState,
        region: value,
        commune: undefined,
        locality: undefined
      }));
    }
  };

  const handleCommuneChange = (value: string) => {
    if (value !== zoneSelection.commune) {
      setZoneSelection((prevState) => ({
        ...prevState,
        commune: value,
        locality: undefined
      }));
    }
  };

  const handleLocalityChange = (value: string) => {
    if (value !== zoneSelection.locality) {
      setZoneSelection((prevState) => ({
        ...prevState,
        locality: value
      }));
    }
  };

  const handleLogin = () => {
    onClose();
    openLoginModal();
  };

  return (
    <>
      <CartChangeZoneModal
        open={updateCartWarningOpen}
        onClose={handleCloseUpdateCartWarning}
        onDecline={handleCloseUpdateCartWarning}
        onContinue={handleAcceptUpdateCartWarning}
        isLoading={isLoading}
      />
      <ZoneModal
        open={open}
        onClose={onClose}
        regionOptions={regions}
        onRegionChange={handleRegionChange}
        communeOptions={communes}
        onCommuneChange={handleCommuneChange}
        localityOptions={canShowDropdownDeliveryZones ? deliveryZones : []}
        onLocalityChange={handleLocalityChange}
        onSubmit={handleValidateSubmitZoneSelection}
        values={zoneSelection}
        isValid={Boolean(zoneSelection.region && zoneSelection.commune)}
        isLoading={isLoading}
        onLoginClick={handleLogin}
      />
    </>
  );
};

export default ZoneSelector;

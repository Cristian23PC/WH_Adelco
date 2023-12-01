import React, { useState, useEffect, FC } from 'react';
import { DeliveryAddressModal } from '@adelco/web-components';
import useSetZone from 'frontastic/actions/adelco/user/useSetZone';
import useShippingAddress from 'frontastic/actions/adelco/user/useShippingAddresses';
import { useRouter } from 'next/router';

export interface Props {
  open: boolean;
  onClose: () => void;
}

const AddressSelector: FC<Props> = ({ open, onClose }) => {
  const { trigger: getShippingAddresses, isLoading } = useShippingAddress();
  const { trigger: setZone } = useSetZone();
  const router = useRouter();

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [addressList, setAddressList] = useState([]);
  const [zoneList, setZoneList] = useState([]);

  useEffect(() => {
    if (open) {
      const setAddresses = async () => {
        const shippingAddresses = await getShippingAddresses();
        if (shippingAddresses.length > 0) {
          const addressOptions = shippingAddresses?.map((address: any) => ({
            id: address.zone.businessUnitId,
            commune: address.shippingAddress.city,
            streetName: address.shippingAddress.streetName,
            streetNumber: address.shippingAddress.streetNumber
          }));
          setZoneList(shippingAddresses);
          setAddressList(addressOptions);
        }
      };
      setAddresses();
    }
  }, [open, getShippingAddresses]);

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleChangeAddress = async () => {
    const addressZone = zoneList.find(
      (addressZone) => addressZone.zone.businessUnitId === selectedAddressId
    );
    const payload = {
      zoneId: undefined,
      dch: addressZone?.zone.dch,
      t2z: addressZone?.zone.t2z,
      minAmount: addressZone?.zone.minAmount,
      regionLabel: addressZone.shippingAddress.region,
      communeLabel: addressZone.shippingAddress.city,
      businessUnitId: addressZone?.zone.businessUnitId,
      deliveryZoneLabel: [
        addressZone.shippingAddress.streetName,
        addressZone.shippingAddress.streetNumber
      ].join(' ')
    };

    await setZone(payload);
    onClose();
  };

  const handleAddAddress = () => {
    router.push('/add-delivery-address');
  };

  return (
    <DeliveryAddressModal
      open={open}
      addressList={addressList}
      selectedAddressId={selectedAddressId}
      onAddAddress={handleAddAddress}
      onSelectAddress={handleSelectAddress}
      onAddressChange={handleChangeAddress}
      onClose={onClose}
    />
  );
};

export default AddressSelector;

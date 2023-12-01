import React, { type FC } from 'react';
import { Button, Modal, OptionRadio } from '../../uikit';
import { type ModalProps } from '../../uikit/feedback/Modal/Modal';
import useScreen from '../../utils/hooks/useScreen/useScreen';

const DEFAULT_LITERALS = {
  title: 'Elige la dirección de entrega',
  subtitle: 'El stock y los precios pueden cambiar debido a este cambio.',
  addAddress: 'Añadir nueva dirección de envío',
  buttonLbl: 'Cambiar dirección'
};
export interface DeliveryAddressModalProps extends ModalProps {
  addressList: Array<{
    id: string;
    commune: string;
    streetName: string;
    streetNumber: string;
  }>;
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
  onAddAddress: VoidFunction;
  onAddressChange: VoidFunction;
  'data-testid'?: string;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]?: string };
}
const DeliveryAddressModal: FC<DeliveryAddressModalProps> = ({
  addressList,
  open,
  onClose,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onAddressChange,
  literals = {},
  'data-testid': testId = 'adelco-delivery-address-modal',
  ...props
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <Modal
      data-testid={testId}
      id="delivery-address-modal"
      onClose={onClose}
      open={open}
      {...props}
    >
      <div className="flex flex-col gap-8 w-64 text-sm">
        <div>
          <p className="text-base font-semibold mb-2.5">{l.title}</p>
          <p>{l.subtitle}</p>
        </div>
        <div className="flex flex-col gap-2 max-h-[170px] overflow-y-auto pr-4 scroll-smooth scrollbar-thin text-left">
          {addressList.map((address) => (
            <OptionRadio
              key={address.id}
              value={address.id}
              onChange={(e) => {
                onSelectAddress(e.target.value);
              }}
              checked={selectedAddressId === address.id}
              label={`${address.streetName} ${address.streetNumber}, ${address.commune}`}
            />
          ))}
        </div>
        <span
          onClick={onAddAddress}
          className="font-semibold underline cursor-pointer"
        >
          {l.addAddress}
        </span>
        <Button
          size={isMobile ? 'md' : 'sm'}
          onClick={onAddressChange}
          variant="secondary"
        >
          {l.buttonLbl}
        </Button>
      </div>
    </Modal>
  );
};

export default DeliveryAddressModal;

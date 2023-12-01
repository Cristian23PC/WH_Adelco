import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import { action } from '@storybook/addon-actions';

import DeliveryAddressModal from './DeliveryAddressModal';
import { Button } from '../../uikit';

export default {
  title: 'Organisms/Delivery Address Modal',
  component: DeliveryAddressModal,
  decorators: [withDesign]
} as ComponentMeta<typeof DeliveryAddressModal>;

const mockAddressList = [
  {
    id: '1',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '2',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '3',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '4',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  }
];

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=11368-675018&mode=design&t=cK4mENmw49LMupvH-0'
  }
};

const Template: ComponentStory<typeof DeliveryAddressModal> = (args) => {
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>('');
  const [open, setOpen] = React.useState<boolean>(false);
  const handleSelectAddress = (id: string): void => {
    action('Select address')(id);
    setSelectedAddressId(id);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open modal
      </Button>
      <DeliveryAddressModal
        {...args}
        onSelectAddress={handleSelectAddress}
        selectedAddressId={selectedAddressId}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      />
    </>
  );
};
export const ModalStory = Template.bind({});
ModalStory.storyName = 'Delivery Address Modal';
ModalStory.args = {
  addressList: mockAddressList,
  onAddAddress: action('Add address')
};
ModalStory.parameters = designParameters;

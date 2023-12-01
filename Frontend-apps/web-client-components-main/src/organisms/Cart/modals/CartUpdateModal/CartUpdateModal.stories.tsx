import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import CartUpdateModal from './CartUpdateModal';
import { Button } from '../../../../uikit';

export default {
  title: 'Organisms/Cart/Modals/CartUpdateModal',
  component: CartUpdateModal,
  decorators: [withDesign]
} as ComponentMeta<typeof CartUpdateModal>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=16766-257462&mode=design&t=zx1lnNbWVXKiH6Pg-4'
  }
};

const Template: ComponentStory<typeof CartUpdateModal> = (args) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open cart update modal
      </Button>
      <CartUpdateModal
        {...args}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      />
    </>
  );
};
export const CartUpdateModalStory = Template.bind({});
CartUpdateModalStory.storyName = 'Cart Update Modal';
CartUpdateModalStory.args = {
  literals: {
    title: 'Actualización',
    continueButtonLabel: 'Aceptar',
    declineButtonLabel: 'Cancelar',
    descriptions: [
      'Al cambiar de ubicación tu carrito será eliminado.',
      '¿Estás seguro de continuar?'
    ]
  }
};
CartUpdateModalStory.parameters = designParameters;

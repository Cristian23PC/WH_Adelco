import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import CartChangeZoneModal from './CartChangeZoneModal';
import { Button } from '../../../../uikit';

export default {
  title: 'Organisms/Cart/Modals/CartChangeZoneModal',
  component: CartChangeZoneModal,
  decorators: [withDesign]
} as ComponentMeta<typeof CartChangeZoneModal>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=16766-257462&mode=design&t=zx1lnNbWVXKiH6Pg-4'
  }
};

const Template: ComponentStory<typeof CartChangeZoneModal> = (args) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open change zone modal
      </Button>
      <CartChangeZoneModal
        {...args}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      />
    </>
  );
};
export const CartChangeZoneModalStory = Template.bind({});
CartChangeZoneModalStory.storyName = 'Cart Change Zone Modal';
CartChangeZoneModalStory.args = {};
CartChangeZoneModalStory.parameters = designParameters;

import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import CartChangePriceStockModal from './CartChangePriceStockModal';
import { Button } from '../../../../uikit';

export default {
  title: 'Organisms/Cart/Modals/CartChangePriceStockModal',
  component: CartChangePriceStockModal,
  decorators: [withDesign]
} as ComponentMeta<typeof CartChangePriceStockModal>;

const designParameters = (
  figmaUrl: string
): { design: { name: string; type: string; url: string } } => ({
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: figmaUrl
  }
});

const Template: ComponentStory<typeof CartChangePriceStockModal> = (args) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open change price or stock modal
      </Button>
      <CartChangePriceStockModal
        {...args}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      />
    </>
  );
};
export const CartChangePriceModalStory = Template.bind({});
CartChangePriceModalStory.storyName = 'Cart Change Price Modal';
CartChangePriceModalStory.args = {
  cartUpdates: {
    isQuantityUpdated: false,
    isPriceUpdated: true
  }
};
CartChangePriceModalStory.parameters = designParameters(
  'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=16766-257510&mode=design&t=owtH9gIz2Sdie99f-4'
);

export const CartChangeStockModalStory = Template.bind({});
CartChangeStockModalStory.storyName = 'Cart Change Stock Modal';
CartChangeStockModalStory.args = {
  cartUpdates: {
    isQuantityUpdated: true,
    isPriceUpdated: false
  }
};
CartChangeStockModalStory.parameters = designParameters(
  'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=16766-257486&mode=design&t=owtH9gIz2Sdie99f-4'
);

export const CartChangePriceStockModalStory = Template.bind({});
CartChangePriceStockModalStory.storyName = 'Cart Change Price and Stock Modal';
CartChangePriceStockModalStory.args = {
  cartUpdates: {
    isQuantityUpdated: true,
    isPriceUpdated: true
  }
};
CartChangePriceStockModalStory.parameters = designParameters(
  'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=16766-257534&mode=design&t=owtH9gIz2Sdie99f-4'
);

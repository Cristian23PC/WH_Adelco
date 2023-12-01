import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Cart from './Cart';
import lineItems from './examples.json';

export default {
  title: 'Organisms/Cart/Cart',
  component: Cart,
  decorators: [withDesign]
} as ComponentMeta<typeof Cart>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=1607-105483&t=UTabhzktHgVLitet-0'
  }
};

const Template: ComponentStory<typeof Cart> = (args) => {
  const [items, setItems] = useState(args?.lineItems);

  const handleDeleteItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ): void => {
    setItems((prevState) => {
      return prevState?.filter((item) => item.id !== id);
    });
  };

  const handleChangeItemUnits = (id: string, quantity: number): void => {
    setItems((prevState) => {
      if (quantity > 0) {
        return prevState?.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity
            };
          }
          return item;
        });
      } else {
        return prevState?.filter((item) => item.id !== id);
      }
    });
  };

  const handleEmptyCart = (): void => {
    setItems([]);
  };

  return (
    <Cart
      {...args}
      lineItems={items}
      onDeleteItem={handleDeleteItem}
      onChangeItemsQuantity={handleChangeItemUnits}
      onEmptyCart={handleEmptyCart}
    />
  );
};
export const story = Template.bind({});
story.parameters = { ...designParameters, layout: 'fullscreen' };
story.storyName = 'Cart';
story.args = {
  lineItems,
  subtotal: '$21.513',
  discountTotal: '$2.437',
  taxes: [
    { description: 'IVA', amount: '$3.624' },
    { description: 'Imp varios', amount: '$1.200' }
  ],
  totalPrice: '$23.900',
  keepBuyingUrl: '?path=/story/ui-kit-structure-grid--grid-component-2',
  freeDelivery: false,
  minImportError: 'Aún no cumples el monto mínimo de compra ($50.000)',
  createOrderDisabled: false,
  linkRenderer: (link, label, target) => (
    <a data-testid="link-rendered" href={link} target={target}>
      {label}
    </a>
  )
};

export const cartWithUpdateWarning = Template.bind({});
cartWithUpdateWarning.parameters = {
  ...designParameters,
  layout: 'fullscreen'
};
cartWithUpdateWarning.storyName = 'Cart With Update Warning';
cartWithUpdateWarning.args = {
  lineItems,
  subtotal: '$21.513',
  discountTotal: '$2.437',
  taxes: [
    { description: 'IVA', amount: '$3.624' },
    { description: 'Imp varios', amount: '$1.200' }
  ],
  totalPrice: '$23.900',
  keepBuyingUrl: '?path=/story/ui-kit-structure-grid--grid-component-2',
  freeDelivery: false,
  minImportError: 'Aún no cumples el monto mínimo de compra ($50.000)',
  createOrderDisabled: false,
  linkRenderer: (link, label, target) => (
    <a data-testid="link-rendered" href={link} target={target}>
      {label}
    </a>
  ),
  cartUpdates: {
    isQuantityUpdated: false,
    isPriceUpdated: true
  }
};

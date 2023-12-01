import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import ProductDetails from './ProductDetails';
import HomeTemplate from '../../utils/HomeTemplate';

export default {
  title: 'Organisms/ProductDetails',
  component: ProductDetails,
  decorators: [withDesign]
} as ComponentMeta<typeof ProductDetails>;

const mockproduct = {
  brandName: 'Espíritu Gaucho',
  name: 'Yerba Mate con Palos Sabor Hierbas Serranas',
  unitSize: '500gr',
  unitPrice: '$580',
  discountPrice: '$435',
  price: '$8.700',
  discount: '-20%',
  packUnits: 20,
  imageUrl: 'https://placehold.co/600x400',
  sku: '87234'
};

const breadcrumbElements = [
  { label: 'Label 1', url: '#' },
  { label: 'Label 2', url: '#' },
  { label: 'Label 3', url: '#' },
  { label: 'Label 4', url: '#' }
];

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?type=design&node-id=2715-124550&t=lpFcVjRXqaU9T0mm-4'
  }
};

const Template: ComponentStory<typeof ProductDetails> = (args) => (
  <ProductDetails {...args} />
);

export const Default = Template.bind({});
Default.args = {
  product: mockproduct,
  showPrice: true,
  amountInCart: 1,
  netTotal: '$9.748',
  discount: '$2.437',
  IVA: '$1.389',
  totalValue: '$8.700'
};
Default.parameters = { ...designParameters, layout: 'fullscreen' };

const HomeExampleTemplate: ComponentStory<typeof ProductDetails> = (args) => {
  const [amountInCart, setAmountInCart] = useState(1);
  return (
    <HomeTemplate>
      <div className="grid place-items-center p-4 tablet:px-6">
        <div className="grid place-items-center w-auto desktop:w-[886px]">
          <ProductDetails
            {...args}
            amountInCart={amountInCart}
            onChangeProductAmount={setAmountInCart}
          />
        </div>
      </div>
    </HomeTemplate>
  );
};

export const HomeExample = HomeExampleTemplate.bind({});
HomeExample.parameters = { layout: 'fullscreen' };
HomeExample.args = {
  product: mockproduct,
  showPrice: true,
  netTotal: '$9.748',
  discount: '$2.437',
  IVA: '$1.389',
  totalValue: '$8.700',
  elements: breadcrumbElements
};

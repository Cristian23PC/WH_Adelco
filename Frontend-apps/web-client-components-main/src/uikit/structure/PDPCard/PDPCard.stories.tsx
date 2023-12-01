import React, { useEffect, useState } from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import PDPCard from './PDPCard';

export default {
  title: 'Ui Kit/Structure/PDPCard',
  component: PDPCard
} as ComponentMeta<typeof PDPCard>;

const mockproduct = {
  brandName: 'Espíritu Gaucho',
  name: 'Yerba Mate con Palos Sabor Hierbas Serranas',
  unitSize: '500gr',
  unitPrice: '$580',
  discountPrice: '$435',
  price: '$8.700',
  discount: '-20%',
  packUnits: 20,
  imageUrl:
    'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-e-_YfJhI.png',
  sku: '87234',
  availableQuantity: 10
};

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=780-64369&t=2Kt4n2yMPqckehmX-4'
  }
};
const Template: ComponentStory<typeof PDPCard> = (args) => {
  const [amountInCart, setAmountInCart] = useState(args.amountInCart ?? 0);

  useEffect(() => {
    setAmountInCart(args.amountInCart ?? 0);
  }, [args.amountInCart]);

  const handleChangeProductAmount = (amount: number): void => {
    setAmountInCart(amount);
  };

  return (
    <div className="flex justify-center">
      <PDPCard
        {...args}
        amountInCart={amountInCart}
        onChangeProductAmount={handleChangeProductAmount}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  product: mockproduct,
  onBack: () => {
    console.log('back');
  },
  netTotal: '$0',
  discount: '$0',
  IVA: '$0',
  totalValue: '$0'
};
Default.parameters = designParameters;
Default.storyName = 'PDPCard';

export const ShowPrice = Template.bind({});
ShowPrice.args = {
  product: mockproduct,
  showPrice: true,
  onBack: () => {
    console.log('back');
  },
  amountInCart: 0,
  netTotal: '$0',
  discount: '$0',
  IVA: '$0',
  totalValue: '$0'
};
ShowPrice.parameters = designParameters;
ShowPrice.storyName = 'PDPCard with price';

export const ShowAmount = Template.bind({});
ShowAmount.args = {
  product: mockproduct,
  showPrice: true,
  onBack: () => {
    console.log('back');
  },
  amountInCart: 1,
  netTotal: '$9.748',
  discount: '$2.437',
  IVA: '$1.389',
  totalValue: '$8.700'
};
ShowAmount.parameters = designParameters;
ShowAmount.storyName = 'PDPCard with amount in cart';

export const OutOfStock = Template.bind({});
OutOfStock.args = {
  product: { ...mockproduct, outOfStock: true },
  showPrice: true,
  onBack: () => {
    console.log('back');
  },
  amountInCart: 0
};
OutOfStock.parameters = designParameters;
OutOfStock.storyName = 'PDPCard out of stock';

export const Loading = Template.bind({});
Loading.args = {
  product: mockproduct,
  showPrice: true,
  onBack: () => {
    console.log('back');
  },
  amountInCart: 0,
  netTotal: '$9.748',
  discount: '$2.437',
  IVA: '$1.389',
  totalValue: '$8.700',
  loading: true
};

export const LoadingInCart = Template.bind({});
LoadingInCart.args = {
  product: mockproduct,
  showPrice: true,
  onBack: () => {
    console.log('back');
  },
  amountInCart: 2,
  netTotal: '$9.748',
  discount: '$2.437',
  IVA: '$1.389',
  totalValue: '$8.700',
  loading: true,
  disabled: true
};

import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import { type LinkRenderer } from '../../../utils/types';

import ProductCard from './ProductCard';
import examples from './ProductCards.example.json';

export default {
  title: 'UI Kit/Structure/ProductCard',
  component: ProductCard,
  decorators: [withDesign]
} as ComponentMeta<typeof ProductCard>;

const mockLinkRenderer: LinkRenderer = (link, label, target) => (
  <a data-testid="link-rendered" href={link} target={target}>
    {label}
  </a>
);

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1059-2802&t=ocGywgPDAekIh15y-4'
  }
};

const Template: ComponentStory<typeof ProductCard> = (args) => {
  const [units, setUnits] = useState(args.units ?? 0);
  return (
    <div className="w-[140px] tablet:w-[146px] desktop:w-[171px] m-5">
      <ProductCard
        {...args}
        units={units}
        onChange={setUnits}
        linkRenderer={mockLinkRenderer}
        productUrl="/path"
      />
    </div>
  );
};

const parameters = { layout: 'fullscreen ' };

export const NotDisplayingPrices = Template.bind({});
NotDisplayingPrices.args = examples[0];
NotDisplayingPrices.parameters = parameters;
NotDisplayingPrices.parameters = designParameters;

export const NotDiscounted = Template.bind({});
NotDiscounted.args = examples[1];
NotDiscounted.parameters = parameters;
NotDiscounted.parameters = designParameters;

export const Discount = Template.bind({});
Discount.args = examples[2];
Discount.parameters = parameters;
Discount.parameters = designParameters;

export const OutOfStock = Template.bind({});
OutOfStock.args = examples[3];
OutOfStock.parameters = parameters;
OutOfStock.parameters = designParameters;

export const InCart = Template.bind({});
InCart.args = examples[4];
InCart.parameters = parameters;
InCart.parameters = designParameters;

export const noPrice = Template.bind({});
noPrice.args = examples[5];
noPrice.parameters = parameters;
noPrice.parameters = designParameters;

export const Loading = Template.bind({});
Loading.args = examples[6];
Loading.parameters = parameters;
Loading.parameters = designParameters;

export const InCartLoading = Template.bind({});
InCartLoading.args = examples[7];
InCartLoading.parameters = parameters;
InCartLoading.parameters = designParameters;

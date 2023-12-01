import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import CategoryCarousel from './CategoryCarousel';
import examples from './examples';
import HomeTemplate from '../../../utils/HomeTemplate/HomeTemplate';
import { type LinkRenderer } from '../../../utils/types';

export default {
  title: 'UI Kit/Structure/Category Carrousel',
  component: CategoryCarousel,
  decorators: [withDesign]
} as ComponentMeta<typeof CategoryCarousel>;

const mockLinkRenderer: LinkRenderer = (link, label, target) => (
  <a data-testid="link-rendered" href={link} target={target}>
    {label}
  </a>
);

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=773-50703&t=e5wHj3qIBPVTd6eQ-0'
  }
};
const Template: ComponentStory<typeof CategoryCarousel> = (args) => {
  return <CategoryCarousel {...args} />;
};

const products = examples.map((example) => {
  return {
    ...example,
    productUrl: `/producto/${example.slug}`,
    linkRenderer: mockLinkRenderer
  };
});

export const CarrouselComponent = Template.bind({});
CarrouselComponent.args = {
  title: 'Category',
  products,
  linkButton: {
    label: 'Ver más',
    url: '#',
    icon: 'arrow_next',
    linkRenderer: mockLinkRenderer
  },
  onClick: console.log
};
CarrouselComponent.parameters = { layout: 'fullscren', ...designParameters };
CarrouselComponent.storyName = 'Category Carrousel';

const Template2: ComponentStory<typeof CategoryCarousel> = (args) => {
  return (
    <HomeTemplate>
      <CategoryCarousel {...args} />
    </HomeTemplate>
  );
};

export const CarrouselComponent2 = Template2.bind({});
CarrouselComponent2.args = {
  title: 'Category',
  products,
  linkButton: {
    label: 'Ver más',
    url: '#',
    icon: 'arrow_next',
    linkRenderer: mockLinkRenderer
  },
  onClick: console.log
};
CarrouselComponent2.parameters = { layout: 'fullscren', ...designParameters };
CarrouselComponent2.storyName = 'Home Page Example';

import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import Grid from './Grid';
import { ProductCard } from '../ProductCard';
import examples from './examples';
import HomeTemplate from '../../../utils/HomeTemplate/HomeTemplate';
import { type LinkRenderer } from '../../../utils/types';

export default {
  title: 'UI Kit/Structure/Grid',
  component: Grid,
  decorators: [withDesign]
} as ComponentMeta<typeof Grid>;

const mockLinkRenderer: LinkRenderer = (link, label, target) => (
  <a data-testid="link-rendered" href={link} target={target}>
    {label}
  </a>
);
const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=1621-369772&t=LD7iIWzZzCyEE6JV-4'
  }
};
const Template: ComponentStory<typeof Grid> = (args) => {
  return (
    <Grid {...args}>
      {examples.map((example, index) => (
        <ProductCard
          {...example}
          linkRenderer={mockLinkRenderer}
          productUrl="/path"
          key={index}
        />
      ))}
    </Grid>
  );
};

export const GridComponent = Template.bind({});
GridComponent.parameters = { layout: 'fullscren', ...designParameters };
GridComponent.storyName = 'Grid';

const Template2: ComponentStory<typeof Grid> = (args) => {
  return (
    <HomeTemplate navBarProps={{ zoneLabel: 'Santiago' }}>
      <div className="grid place-items-center p-4 tablet:px-6">
        <div className="grid place-items-center desktop:w-[886px]">
          <Grid {...args}>
            {examples.map((example, index) => (
              <ProductCard
                {...example}
                linkRenderer={mockLinkRenderer}
                productUrl="/path"
                key={index}
              />
            ))}
          </Grid>
        </div>
      </div>
    </HomeTemplate>
  );
};

export const GridComponent2 = Template2.bind({});
GridComponent2.parameters = { layout: 'fullscren', ...designParameters };
GridComponent2.storyName = 'Product List Example';

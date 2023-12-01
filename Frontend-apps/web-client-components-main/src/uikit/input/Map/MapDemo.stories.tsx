import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import MapDemoComponent from './MapDemo';

export default {
  title: 'Ui Kit/Input/Map',
  component: MapDemoComponent,
  decorators: [withDesign]
} as ComponentMeta<typeof MapDemoComponent>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-143023&t=64zO8Xjqwbc5NZw2-4'
  }
};

const Template: ComponentStory<typeof MapDemoComponent> = (args) => (
  <MapDemoComponent {...args} />
);

export const InteractiveDemo = Template.bind({});
InteractiveDemo.parameters = designParameters;

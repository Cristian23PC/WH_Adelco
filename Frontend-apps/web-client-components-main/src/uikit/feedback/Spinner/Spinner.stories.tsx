import React from 'react';
import { type Story, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import Spinner, { type SpinnerProps } from './Spinner';

export default {
  title: 'UI Kit/Feedback/Spinner',
  component: Spinner,
  decorators: [withDesign]
} as ComponentMeta<typeof Spinner>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=14614-349024&mode=design&t=2rTxj4pv48M7CHjE-0'
  }
};

const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />;

export const Display = Template.bind({});
Display.args = {
  backdropColor: 'white',
  opacity: '50'
};
Display.storyName = 'Spinner';
Display.parameters = { ...designParameters, layout: 'fullscreen' };

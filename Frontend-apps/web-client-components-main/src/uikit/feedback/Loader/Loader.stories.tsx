import React from 'react';
import { type Story, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import Loader, { type LoaderProps } from './Loader';

export default {
  title: 'UI Kit/Feedback/Loader',
  component: Loader,
  decorators: [withDesign]
} as ComponentMeta<typeof Loader>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=1621-369423&t=WriFei45aOBeNbsw-4'
  }
};

const Template: Story<LoaderProps> = (args) => <Loader {...args} />;

export const Display = Template.bind({});
Display.storyName = 'Loader';
Display.args = {
  label: 'Cargando...'
};
Display.parameters = { ...designParameters, layout: 'fullscreen' };

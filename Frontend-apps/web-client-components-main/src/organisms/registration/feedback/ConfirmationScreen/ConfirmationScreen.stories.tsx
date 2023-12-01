import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import ConfirmationScreen from './ConfirmationScreen';

export default {
  title: 'Organisms/Registration/Feedback/Confirmation Screen',
  component: ConfirmationScreen,
  decorators: [withDesign]
} as ComponentMeta<typeof ConfirmationScreen>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=6548-204575&t=bZyiXmDJElue6m9L-4'
  }
};

const Template: ComponentStory<typeof ConfirmationScreen> = (args) => (
  <ConfirmationScreen {...args} />
);

export const Story = Template.bind({});
Story.storyName = 'Confirmation Screen';
Story.parameters = { layout: 'fullscreen', ...designParameters };
Story.args = {
  clientData: {
    name: 'Juan Pérez',
    email: 'jperez@gmail.com',
    phoneNumber: '+56 9 9320 8891'
  },
  billingAddress: {
    region: 'Región Metropolitana',
    commune: 'La Florida',
    streetName: 'Juan Pablo II',
    number: '8290'
  },
  callCenter: '600 600 6363'
};

import React from 'react';
import { type Story, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import Chip, { type ChipProps } from './Chip';

export default {
  title: 'UI Kit/Feedback/Chip',
  component: Chip,
  decorators: [withDesign]
} as ComponentMeta<typeof Chip>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1140-3517&t=ntDYEfoAxX4Iix8v-0'
  }
};

const Template: Story<ChipProps> = (args) => <Chip {...args} />;

export const Display = Template.bind({});
Display.storyName = 'Chip';
Display.args = {
  label: 'Cheque al día',
  active: false,
  size: 'small',
  onClose: () => {
    console.log('closing..');
  },
  onClick: () => {
    console.log('action..');
  }
};
Display.parameters = designParameters;

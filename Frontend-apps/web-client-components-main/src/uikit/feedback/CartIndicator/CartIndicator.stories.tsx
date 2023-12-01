import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import CartIndicator from './CartIndicator';

export default {
  title: 'UI Kit/Feedback/CartIndicator',
  component: CartIndicator,
  decorators: [withDesign]
} as ComponentMeta<typeof CartIndicator>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=2082-3470&t=Ts9XQdsa82DPIfLE-4'
  }
};

const Template: ComponentStory<typeof CartIndicator> = (args) => (
  <CartIndicator {...args} />
);

export const Story = Template.bind({});
Story.args = {
  quantity: 1
};
Story.parameters = designParameters;
Story.storyName = 'CartIndicator';

export const MoreThan99 = Template.bind({});
MoreThan99.args = {
  quantity: 157
};
MoreThan99.parameters = designParameters;

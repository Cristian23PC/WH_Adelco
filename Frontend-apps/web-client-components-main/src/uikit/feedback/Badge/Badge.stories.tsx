import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import Badge from './Badge';

export default {
  title: 'UI Kit/Feedback/Badge',
  component: Badge,
  decorators: [withDesign]
} as ComponentMeta<typeof Badge>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=2078-4000&t=xn2WBIvSLzuuCThw-4'
  }
};

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const Story = Template.bind({});
Story.args = {
  size: 'md',
  children: '-25%'
};
Story.parameters = designParameters;
Story.storyName = 'Badge';

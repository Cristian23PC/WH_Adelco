import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import IconComponent from './Icon';

export default {
  title: 'Ui Kit/Feedback/Icon',
  component: IconComponent,
  decorators: [withDesign]
} as ComponentMeta<typeof IconComponent>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1138-3114&t=6jP8yqZXk6OO3aRg-4'
  }
};

const Template: ComponentStory<typeof IconComponent> = (args) => (
  <IconComponent {...args} className="h-300 w-300" />
);

export const Icon = Template.bind({});
Icon.args = {
  name: 'add'
};
Icon.parameters = designParameters;

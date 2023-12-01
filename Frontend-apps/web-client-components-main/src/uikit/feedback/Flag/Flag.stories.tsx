import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import FlagComponent from './Flag';

export default {
  title: 'Ui Kit/Feedback/Flag',
  component: FlagComponent,
  decorators: [withDesign]
} as ComponentMeta<typeof FlagComponent>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=2192-5110&t=imtyJQvwrvLzr0IN-4'
  }
};

const Template: ComponentStory<typeof FlagComponent> = (args) => (
  <FlagComponent {...args} />
);

export const Flag = Template.bind({});
Flag.args = {
  name: 'cl'
};
Flag.parameters = designParameters;

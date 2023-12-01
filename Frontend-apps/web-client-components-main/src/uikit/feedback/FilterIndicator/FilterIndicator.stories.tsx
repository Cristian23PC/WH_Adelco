import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import FilterIndicator from './FilterIndicator';

export default {
  title: 'UI Kit/Feedback/FilterIndicator',
  component: FilterIndicator,
  decorators: [withDesign]
} as ComponentMeta<typeof FilterIndicator>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=2210-3992&t=Ts9XQdsa82DPIfLE-4'
  }
};

const Template: ComponentStory<typeof FilterIndicator> = (args) => (
  <FilterIndicator {...args} />
);

export const Story = Template.bind({});
Story.args = {
  quantity: 5
};
Story.parameters = designParameters;
Story.storyName = 'FilterIndicator';

export const WithLabel = Template.bind({});
WithLabel.args = {
  quantity: 5,
  label: 'aplicados'
};
WithLabel.parameters = designParameters;

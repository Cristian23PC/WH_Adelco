import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import NoResults from './NoResults';

export default {
  title: 'PLP/No Results',
  component: NoResults,
  decorators: [withDesign]
} as ComponentMeta<typeof NoResults>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=1621-369315&t=wYpB4NvzlKKHCSc0-0'
  }
};

const Template: ComponentStory<typeof NoResults> = (args) => (
  <NoResults {...args} />
);
export const NoResultsStory = Template.bind({});
NoResultsStory.storyName = 'No Results';
NoResultsStory.parameters = designParameters;
NoResultsStory.args = {
  searchedTerm: 'Leche',
  onClick: () => {}
};

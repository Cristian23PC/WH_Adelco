import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import AlreadyRegisteredScreen from './AlreadyRegisteredScreen';

export default {
  title:
    'Organisms/Registration/Feedback/Warning Screen/Already Registered Screen',
  component: AlreadyRegisteredScreen,
  decorators: [withDesign]
} as ComponentMeta<typeof AlreadyRegisteredScreen>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-142615&t=oUl2PuwTQY1rPHtu-4'
  }
};

const Template: ComponentStory<typeof AlreadyRegisteredScreen> = (args) => (
  <AlreadyRegisteredScreen {...args} />
);

export const Story = Template.bind({});
Story.storyName = 'Already Registered Screen';
Story.parameters = { layout: 'fullscreen', ...designParameters };
Story.args = {
  onLogin: console.log
};

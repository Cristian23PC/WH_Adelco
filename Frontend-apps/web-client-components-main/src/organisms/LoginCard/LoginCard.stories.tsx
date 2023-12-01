import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import LoginCard from './LoginCard';

export default {
  title: 'Ui Kit/Actions/LoginCard',
  component: LoginCard,
  decorators: [withDesign]
} as ComponentMeta<typeof LoginCard>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=14127-321774&mode=design&t=rGZyU4OQgwwyhyrY-4'
  },
  layout: 'fullscreen'
};

const Template: ComponentStory<typeof LoginCard> = (args) => (
  <div className="tablet:w-[430px]">
    <LoginCard {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  username: 'Manuel'
};
Default.parameters = designParameters;

import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import WelcomeModal from './WelcomeModal';

export default {
  title: 'Organisms/WelcomeModal',
  component: WelcomeModal,
  decorators: [withDesign]
} as ComponentMeta<typeof WelcomeModal>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=20129-450355&mode=design&t=7aXdGzd92QVXXPlG-4'
  }
};

const Template: ComponentStory<typeof WelcomeModal> = (args) => (
  <WelcomeModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true,
  linkRenderer: (link, label, target) => (
    <a data-testid="link-rendered" href={link} target={target}>
      {label}
    </a>
  ),
  registerLink: '/register',
  onClickLogin: () => {
    console.log('Click on Inicia Session');
  },
  onClose: () => {
    console.log('Click on close icon');
  }
};
Default.parameters = { ...designParameters, layout: 'fullscreen' };
Default.storyName = 'WelcomeModal';

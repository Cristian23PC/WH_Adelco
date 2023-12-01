import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import SimpleNavbar from './SimpleNavbar';
import { linkRendererMock } from '../CategoriesMenu/CategoriesMenuMocks';

export default {
  title: 'UI Kit/Navigation/SimpleNavbar',
  component: SimpleNavbar,
  decorators: [withDesign]
} as ComponentMeta<typeof SimpleNavbar>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2109-134028&t=pZcB0h9erftigVfc-4'
  }
};

const Template: ComponentStory<typeof SimpleNavbar> = (args) => (
  <SimpleNavbar {...args} />
);

export const Default = Template.bind({});
Default.storyName = 'Simple Navbar';
Default.parameters = { layout: 'fullscreen', ...designParameters };
Default.args = {
  linkRenderer: linkRendererMock,
  showLoginButton: false,
  centered: false
};

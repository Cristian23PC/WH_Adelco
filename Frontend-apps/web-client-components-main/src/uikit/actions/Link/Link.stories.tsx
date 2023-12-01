import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';

import Link from './Link';
import { type LinkRenderer } from '../../../utils/types';

export default {
  title: 'Ui Kit/Actions/Link',
  component: Link
} as ComponentMeta<typeof Link>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1202%3A4797&t=MAAdK5Dvqn6FBntr-4'
  }
};

const linkRenderer: LinkRenderer = (link, label, target) => (
  <a href={link} target={target}>
    {label}
  </a>
);

const Template: ComponentStory<typeof Link> = (args) => (
  <Link {...args}>Link</Link>
);

export const Primary = Template.bind({});
Primary.args = {
  iconName: 'add',
  url: '#',
  disabled: false,
  linkRenderer
};
Primary.parameters = designParameters;

export const Secondary = Template.bind({});
Secondary.args = {
  iconName: 'add',
  url: '#',
  variant: 'secondary',
  disabled: false,
  linkRenderer
};
Secondary.parameters = designParameters;

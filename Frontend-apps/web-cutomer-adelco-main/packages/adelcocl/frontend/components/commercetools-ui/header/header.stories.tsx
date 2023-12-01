import React from 'react';
import { Story, Meta } from '@storybook/react';
import { headerButtonLink, headerAccountLink, headerLinks } from 'helpers/mocks/mockData';
import Header, { HeaderProps } from './index';

export default {
  title: 'Frontastic/Header',
  component: Header,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<HeaderProps> = (args) => <Header {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  tagline: '',
  logo: { media: { mediaId: 'v1674814009/iv0k0u6m8xntgdqt4eal.png' } },
  logoLink: headerButtonLink,
  links: headerLinks,
  accountLink: headerAccountLink,
  searchLink: headerButtonLink,
  cartLink: headerButtonLink,
  wishlistLink: headerButtonLink,
  cartItemCount: 2,
  wishlistItemCount: 3,
};

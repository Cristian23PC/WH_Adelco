import React from 'react';
import { type Story, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Notification, { type NotificationProps } from './Notification';

export default {
  title: 'UI Kit/Feedback/Notification',
  component: Notification,
  decorators: [withDesign]
} as ComponentMeta<typeof Notification>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=3668-5485&mode=design&t=SYQKeuFhZXgbLxY1-4'
  }
};

const Template: Story<NotificationProps> = (args) => <Notification {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: 'Advertencia',
  text: 'Los precios podrían sufrir variaciones',
  type: 'warning',
  iconName: 'error'
};
Default.storyName = 'Notification';
Default.parameters = { ...designParameters, layout: 'fullscreen' };

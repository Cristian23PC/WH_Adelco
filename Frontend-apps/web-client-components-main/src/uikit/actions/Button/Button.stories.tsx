import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import Button from './Button';

export default {
  title: 'Ui Kit/Actions/Button',
  component: Button,
  decorators: [withDesign]
} as ComponentMeta<typeof Button>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1202-4481&t=xn2WBIvSLzuuCThw-4'
  }
};

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Botón',
  iconName: 'map'
};
Primary.parameters = designParameters;

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Botón',
  iconName: 'map'
};
Secondary.parameters = designParameters;

export const Tertiary = Template.bind({});
Tertiary.args = {
  variant: 'tertiary',
  children: 'Botón',
  iconName: 'map'
};
Tertiary.parameters = designParameters;

export const OnlyIcon = Template.bind({});
OnlyIcon.args = {
  variant: 'primary',
  iconName: 'map',
  size: 'md'
};
OnlyIcon.parameters = designParameters;

export const OnlyText = Template.bind({});
OnlyText.args = {
  variant: 'primary',
  children: 'Botón',
  size: 'md'
};
OnlyText.parameters = designParameters;

export const SmallButton = Template.bind({});
SmallButton.args = {
  variant: 'primary',
  children: 'Botón',
  size: 'xs',
  iconName: 'map'
};
SmallButton.parameters = designParameters;

export const MediumButton = Template.bind({});
MediumButton.args = {
  variant: 'primary',
  children: 'Botón',
  iconName: 'map',
  size: 'sm'
};
MediumButton.parameters = designParameters;

export const LargeButton = Template.bind({});
LargeButton.args = {
  variant: 'primary',
  children: 'Botón',
  iconName: 'map',
  size: 'md'
};
LargeButton.parameters = designParameters;

export const LoadingButton = Template.bind({});
LoadingButton.args = {
  variant: 'primary',
  children: 'Botón',
  iconName: 'map',
  size: 'md',
  loading: true
};
LoadingButton.parameters = designParameters;

export const BlockButton = Template.bind({});
BlockButton.args = {
  variant: 'primary',
  children: 'Botón',
  iconName: 'map',
  size: 'md',
  block: true
};
BlockButton.parameters = designParameters;

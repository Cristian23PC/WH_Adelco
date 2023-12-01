import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { InputMessage } from './InputMessage';

export default {
  title: 'UI Kit/Feedback/InputMessage',
  component: InputMessage,
  decorators: [withDesign]
} as ComponentMeta<typeof InputMessage>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=3994-5618&t=yMBGFXTCSaT3RAjJ-4'
  }
};

const Template: ComponentStory<typeof InputMessage> = (args) => {
  return (
    <>
      <InputMessage variant={args.variant} iconName={args.iconName}>
        {args.children}
      </InputMessage>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: 'Este es un mensaje de prueba'
};
Default.parameters = designParameters;

export const Success = Template.bind({});
Success.args = {
  variant: 'success',
  iconName: 'done',
  children: 'Este es un mensaje de prueba'
};
Success.parameters = designParameters;

export const Warning = Template.bind({});
Warning.args = {
  variant: 'warning',
  iconName: 'error',
  children: 'Este es un mensaje de prueba'
};
Warning.parameters = designParameters;

export const Error = Template.bind({});
Error.args = {
  variant: 'failure',
  iconName: 'error',
  children: 'Este es un mensaje de prueba'
};
Error.parameters = designParameters;

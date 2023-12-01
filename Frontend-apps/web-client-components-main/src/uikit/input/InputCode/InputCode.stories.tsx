import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import InputCode from './InputCode';

export default {
  title: 'Ui Kit/Input/InputCode',
  component: InputCode,
  decorators: [withDesign]
} as ComponentMeta<typeof InputCode>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=3010-5296&t=EtXwbGOn4kUU0526-4'
  }
};

const Template: ComponentStory<typeof InputCode> = (args) => {
  return (
    <div className="m-auto w-[300px]">
      <InputCode {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = { onSubmit: console.log };
Default.parameters = designParameters;

export const Error = Template.bind({});
Error.args = {
  errorMessage: 'Usted ha introducido el codigo erroneo.\nTiene 2 intentos más',
  onSubmit: console.log
};
Error.parameters = designParameters;

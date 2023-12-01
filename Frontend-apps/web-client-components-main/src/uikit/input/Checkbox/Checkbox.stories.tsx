import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Checkbox from './Checkbox';

export default {
  title: 'Ui Kit/Input/Checkbox',
  component: Checkbox,
  decorators: [withDesign]
} as ComponentMeta<typeof Checkbox>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1106-3317&t=Gyme7lXpfOMHbLwn-4'
  }
};

const Template: ComponentStory<typeof Checkbox> = (args) => {
  const [checked, setChecked] = useState(true);

  const handleChange = (): void => {
    setChecked(!checked);
  };

  return <Checkbox {...args} checked={checked} onChange={handleChange} />;
};

export const Small = Template.bind({});
Small.args = { variant: 'sm' };
Small.parameters = designParameters;

export const Medium = Template.bind({});
Medium.args = { variant: 'md' };
Medium.parameters = designParameters;

export const Large = Template.bind({});
Large.args = { variant: 'lg' };
Large.parameters = designParameters;

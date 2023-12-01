import React, { useState, type ChangeEvent } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Radio from './Radio';

export default {
  title: 'Ui Kit/Input/Radio',
  component: Radio,
  decorators: [withDesign]
} as ComponentMeta<typeof Radio>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1106-3255&t=gPUEocOgwdcg53XQ-4'
  }
};

const Template: ComponentStory<typeof Radio> = (args) => {
  const [selected, setSelected] = useState('1');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelected(e.target.value);
  };

  return (
    <div className="flex gap-4">
      <Radio
        value="1"
        checked={selected === '1'}
        onChange={handleChange}
        {...args}
      />
      <Radio
        value="2"
        checked={selected === '2'}
        onChange={handleChange}
        {...args}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = { name: 'radio' };
Default.parameters = designParameters;

export const Small = Template.bind({});
Small.args = { name: 'radio', variant: 'sm' };
Small.parameters = designParameters;

export const Medium = Template.bind({});
Medium.args = { name: 'radio', variant: 'md' };
Medium.parameters = designParameters;

export const Large = Template.bind({});
Large.args = { name: 'radio', variant: 'lg' };
Large.parameters = designParameters;

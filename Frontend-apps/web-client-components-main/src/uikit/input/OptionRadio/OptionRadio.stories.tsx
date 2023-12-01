import React, { type ChangeEvent, useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import OptionRadio from './OptionRadio';

export default {
  title: 'Ui Kit/Input/OptionRadio',
  component: OptionRadio,
  decorators: [withDesign]
} as ComponentMeta<typeof OptionRadio>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1202-4925&t=moFxXxDvOTPC3cdI-4'
  }
};

const Template: ComponentStory<typeof OptionRadio> = (args) => {
  const [selected, setSelected] = useState('1');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelected(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <OptionRadio
        value="1"
        checked={selected === '1'}
        onChange={handleChange}
        {...args}
      />
      <OptionRadio
        value="2"
        checked={selected === '2'}
        onChange={handleChange}
        {...args}
      />
      <OptionRadio
        value="3"
        checked={selected === '3'}
        onChange={handleChange}
        {...args}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Option Radio',
  name: 'radio'
};
Default.parameters = designParameters;

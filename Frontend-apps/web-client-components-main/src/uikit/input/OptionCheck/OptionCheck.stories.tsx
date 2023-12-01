import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import OptionCheck from './OptionCheck';

export default {
  title: 'Ui Kit/Input/OptionCheck',
  component: OptionCheck,
  decorators: [withDesign]
} as ComponentMeta<typeof OptionCheck>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1758-5338&t=D6dFwFKLQPu6RuVo-4'
  }
};

const Template: ComponentStory<typeof OptionCheck> = (args) => {
  const [checked, setChecked] = useState(true);

  const handleChange = (): void => {
    setChecked(!checked);
  };

  return <OptionCheck {...args} checked={checked} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Opción',
  disabled: false
};
Default.parameters = designParameters;

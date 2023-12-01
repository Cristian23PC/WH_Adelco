import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Switch from './Switch';

export default {
  title: 'Ui Kit/Input/Switch',
  component: Switch,
  decorators: [withDesign]
} as ComponentMeta<typeof Switch>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1106-3289&mode=design&t=pZXFZJRzO8jDVc5l-4'
  }
};

const Template: ComponentStory<typeof Switch> = (args) => {
  const [checked, setChecked] = useState(true);

  const handleChange = (): void => {
    setChecked(!checked);
  };

  return <Switch {...args} checked={checked} onChange={handleChange} />;
};

export const SwitchSmall = Template.bind({});
SwitchSmall.args = { variant: 'sm' };
SwitchSmall.parameters = designParameters;
SwitchSmall.storyName = 'Small';

export const SwitchMedium = Template.bind({});
SwitchMedium.args = { variant: 'md' };
SwitchMedium.parameters = designParameters;
SwitchMedium.storyName = 'Medium';

export const SwitchLarge = Template.bind({});
SwitchLarge.args = { variant: 'lg', checked: true };
SwitchLarge.parameters = designParameters;
SwitchLarge.storyName = 'Large';

import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Dropdown from './Dropdown';
import { options, largeOptions, optionsWithIcons } from './Dropdown.mock';
import DropdownDemo from './Dropdown.demo';

export default {
  title: 'UI Kit/Input/Dropdown',
  component: Dropdown,
  decorators: [withDesign]
} as ComponentMeta<typeof Dropdown>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1140-3528&t=VlzX6emqIv5eVDUQ-0'
  }
};

const Template: ComponentStory<typeof Dropdown> = (args) => {
  return (
    <div className="w-80 max-w-full">
      <DropdownDemo {...args} />
    </div>
  );
};

export const DropdownStory = Template.bind({});
DropdownStory.storyName = 'Dropdown';
DropdownStory.parameters = designParameters;
DropdownStory.args = {
  label: 'DropDown List',
  options
};

export const DropdownDisabled = Template.bind({});
DropdownDisabled.parameters = designParameters;
DropdownDisabled.args = {
  label: 'DropDown Disabled',
  options,
  disabled: true
};

export const DropdownWithLongLabels = Template.bind({});
DropdownWithLongLabels.parameters = designParameters;
DropdownWithLongLabels.args = {
  label: 'Dropdown with very long label to can test overflow',
  options: largeOptions
};

export const DropdownWithIcons = Template.bind({});
DropdownWithIcons.parameters = designParameters;
DropdownWithIcons.args = {
  label: 'Dropdown with icons',
  options: optionsWithIcons
};

export const DropdownHelperText = Template.bind({});
DropdownHelperText.args = {
  label: 'Dropdown with helper text',
  helperText: 'Helper text',
  helperIcon: 'error',
  options
};

export const DropdownHelperTextFailure = Template.bind({});
DropdownHelperTextFailure.args = {
  variant: 'failure',
  label: 'Dropdown failure',
  helperText: 'Helper text',
  helperIcon: 'error',
  options
};

export const DropdownHelperTextWarning = Template.bind({});
DropdownHelperTextWarning.args = {
  variant: 'warning',
  label: 'Dropdown warning',
  helperText: 'Helper text',
  helperIcon: 'error',
  options
};

export const DropdownHelperTextSuccess = Template.bind({});
DropdownHelperTextSuccess.args = {
  variant: 'success',
  label: 'Dropdown success',
  helperText: 'Helper text',
  helperIcon: 'sentiment_satisfied',
  options
};

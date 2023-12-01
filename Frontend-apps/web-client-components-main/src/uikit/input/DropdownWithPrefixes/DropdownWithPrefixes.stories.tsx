import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import DropdownWithPrefixes from './DropdownWithPrefixes';

export default {
  title: 'UI Kit/Input/Dropdown/Dropdown With Prefixes',
  component: DropdownWithPrefixes,
  decorators: [withDesign]
} as ComponentMeta<typeof DropdownWithPrefixes>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1140-3528&t=VlzX6emqIv5eVDUQ-0'
  }
};

const Template: ComponentStory<typeof DropdownWithPrefixes> = (args) => {
  const [value, setValue] = useState('');

  return (
    <div className="w-80 max-w-full">
      <DropdownWithPrefixes {...args} onChange={setValue} value={value} />
    </div>
  );
};

export const DropdownWithPrefixesStory = Template.bind({});
DropdownWithPrefixesStory.parameters = designParameters;
DropdownWithPrefixesStory.storyName = 'Dropdown With Prefixes';

export const DropdownWithPrefixesHelperText = Template.bind({});
DropdownWithPrefixesHelperText.args = {
  value: 'Value',
  helperText: 'Helper text',
  helperIcon: 'error'
};

export const DropdownWithPrefixesHelperTextFailure = Template.bind({});
DropdownWithPrefixesHelperTextFailure.args = {
  variant: 'failure',
  value: 'Incorrect value',
  helperText: 'Helper text',
  helperIcon: 'error'
};

export const DropdownWithPrefixesHelperTextWarning = Template.bind({});
DropdownWithPrefixesHelperTextWarning.args = {
  variant: 'warning',
  value: 'warning value',
  helperText: 'Helper text',
  helperIcon: 'error'
};

export const DropdownWithPrefixesHelperTextSuccess = Template.bind({});
DropdownWithPrefixesHelperTextSuccess.args = {
  variant: 'success',
  value: 'Success value',
  helperText: 'Helper text',
  helperIcon: 'sentiment_satisfied'
};

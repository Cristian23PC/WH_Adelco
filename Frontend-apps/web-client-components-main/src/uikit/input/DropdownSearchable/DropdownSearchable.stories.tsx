/* eslint-disable */
import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import DropdownSearchable from './DropdownSearchable';

export default {
  title: 'UI Kit/Input/Dropdown/Dropdown Searchable',
  component: DropdownSearchable,
  decorators: [withDesign]
} as ComponentMeta<typeof DropdownSearchable>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=2261-6350&mode=dev'
  }
};

const opt = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'pear', label: 'Pear' },
  { value: 'carrot', label: 'Carrot' },
  { value: 'broccoli', label: 'Broccoli' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'potato', label: 'Potato' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'beef', label: 'Beef' }
];

const Template: ComponentStory<typeof DropdownSearchable> = (args) => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState(opt);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnSearch = (value: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const optSearched = opt.filter(({ label }) =>
        label.toLowerCase().includes(value.toLowerCase())
      );
      setOptions(optSearched);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-80 max-w-full">
      <DropdownSearchable
        {...args}
        onChange={setValue}
        value={value}
        options={options}
        onSearch={handleOnSearch}
        isLoading={isLoading}
        placeholder="Please choose a fruit"
      />
    </div>
  );
};

export const DropdownSearchableStory = Template.bind({});
DropdownSearchableStory.parameters = designParameters;
DropdownSearchableStory.storyName = 'Dropdown Searchable';

export const DropdownSearchableHelperText = Template.bind({});
DropdownSearchableHelperText.args = {
  value: 'Value',
  helperText: 'Helper text',
  helperIcon: 'error'
};

export const DropdownSearchableHelperTextFailure = Template.bind({});
DropdownSearchableHelperTextFailure.args = {
  variant: 'failure',
  value: 'Incorrect value',
  helperText: 'Helper text',
  helperIcon: 'error'
};

export const DropdownSearchableHelperTextWarning = Template.bind({});
DropdownSearchableHelperTextWarning.args = {
  variant: 'warning',
  value: 'warning value',
  helperText: 'Helper text',
  helperIcon: 'error'
};

export const DropdownSearchableHelperTextSuccess = Template.bind({});
DropdownSearchableHelperTextSuccess.args = {
  variant: 'success',
  value: 'Success value',
  helperText: 'Helper text',
  helperIcon: 'sentiment_satisfied'
};

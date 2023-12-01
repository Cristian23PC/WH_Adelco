/* eslint-disable */
import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import DropdownMultiselect from './DropdownMultiselect';

export default {
  title: 'UI Kit/Input/Dropdown/Dropdown Multiselect',
  component: DropdownMultiselect,
  decorators: [withDesign]
} as ComponentMeta<typeof DropdownMultiselect>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/J1KIL9QYoFafGo20Cu14yY/Management-Website?type=design&node-id=3433-126542&mode=design&t=7Y7DqDfgupEKykp3-0'
  }
};

const options = [
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

const Template: ComponentStory<typeof DropdownMultiselect> = (args) => {
  const [value, setValue] = useState(args.value || []);

  const handleOnSearch = (searchText: string) => {
    console.log('search ', searchText);
  };

  const handleOnChange = (newValue: string[]) => {
    console.log('newValue ', newValue);
    setValue(newValue);
  };

  return (
    <div className="w-44 ml-10">
      <DropdownMultiselect
        {...args}
        onChange={handleOnChange}
        onSearch={handleOnSearch}
        value={value}
        title={`${args.title}${value.length ? ` (${value.length})` : ''}`}
      />
    </div>
  );
};

export const DropdownMultipleStory = Template.bind({});
DropdownMultipleStory.parameters = designParameters;
DropdownMultipleStory.args = {
  options,
  value: ['apple'],
  placeholder: 'Please choose a fruit',
  title: 'Fruits',
  literals: {
    notFoundLabel: 'Fruits not found'
  },
  isSearchable: true
};
DropdownMultipleStory.storyName = 'Dropdown Multiselect';

export const DropdownMultiselectHelperText = Template.bind({});
DropdownMultiselectHelperText.args = {
  options,
  title: 'Fruits',
  value: ['apple'],
  helperText: 'Helper text',
  helperIcon: 'error',
  isSearchable: true
};

export const DropdownMultiselectHelperTextFailure = Template.bind({});
DropdownMultiselectHelperTextFailure.args = {
  options,
  title: 'Fruits',
  variant: 'failure',
  value: ['apple'],
  helperText: 'Helper text',
  helperIcon: 'error',
  isSearchable: true
};

export const DropdownMultiselectHelperTextWarning = Template.bind({});
DropdownMultiselectHelperTextWarning.args = {
  options,
  title: 'Fruits',
  variant: 'warning',
  value: ['apple'],
  helperText: 'Helper text',
  helperIcon: 'error',
  isSearchable: true
};

export const DropdownMultiselectHelperTextSuccess = Template.bind({});
DropdownMultiselectHelperTextSuccess.args = {
  options,
  title: 'Fruits',
  variant: 'success',
  value: ['apple'],
  helperText: 'Helper text',
  helperIcon: 'sentiment_satisfied',
  isSearchable: true
};

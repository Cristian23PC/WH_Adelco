import React, { useEffect } from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import TextField from './TextField';

export default {
  title: 'Ui Kit/Input/TextField',
  component: TextField,
  excludeStories: /DefaultLogo/
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => {
  const [value, setValue] = React.useState(args.value);

  useEffect(() => {
    setValue(args.value);
  }, [args.value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return <TextField {...args} value={value} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  value: 'Value',
  placeholder: 'Placeholder',
  id: 'textfield-1'
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: 'Label',
  value: 'Value',
  iconName: 'search',
  id: 'textfield-2',
  onClickIcon: () => {
    console.log('Icon clicked');
  }
};

export const Number = Template.bind({});
Number.args = {
  label: 'Label',
  value: '1234',
  type: 'number',
  id: 'textfield-3'
};

export const Email = Template.bind({});
Email.args = {
  label: 'Label',
  value: 'email@mail.com',
  type: 'email',
  id: 'textfield-4'
};

export const Password = Template.bind({});
Password.args = {
  label: 'Label',
  value: 'password',
  type: 'password',
  id: 'textfield-5'
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Label',
  disabled: true,
  id: 'textfield-6'
};

export const HelperText = Template.bind({});
HelperText.args = {
  label: 'Label',
  value: 'Value',
  helperText: 'Helper text',
  helperIcon: 'error',
  id: 'textfield-7'
};

export const HelperTextFailure = Template.bind({});
HelperTextFailure.args = {
  label: 'Label',
  variant: 'failure',
  value: 'Incorrect value',
  helperText: 'Helper text',
  helperIcon: 'error',
  id: 'textfield-8'
};

export const HelperTextWarning = Template.bind({});
HelperTextWarning.args = {
  label: 'Label',
  variant: 'warning',
  value: 'warning value',
  helperText: 'Helper text',
  helperIcon: 'error',
  id: 'textfield-9'
};

export const HelperTextSuccess = Template.bind({});
HelperTextSuccess.args = {
  label: 'Label',
  variant: 'success',
  value: 'Success value',
  helperText: 'Helper text',
  helperIcon: 'error',
  id: 'textfield-10'
};

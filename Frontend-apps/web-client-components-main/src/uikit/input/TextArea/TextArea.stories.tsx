import React, { type ChangeEvent, useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import TextArea, { type TextAreaProps } from './TextArea';

export default {
  title: 'UI Kit/Input/TextArea',
  component: TextArea,
  decorators: [withDesign]
} as ComponentMeta<typeof TextArea>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1161-7562&mode=dev'
  }
};

const Template: ComponentStory<typeof TextArea> = (args: TextAreaProps) => {
  const [textValue, setTextValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOnChange = (data: ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = data.target;
    setTextValue(value);
    if (args.maxLength) {
      setError(
        value.length <= args.maxLength
          ? null
          : `Excediste el máximo de ${args.maxLength} caracteres.`
      );
    }
  };

  return (
    <div className="relative w-full tablet:w-[255px] desktop:w-[437px] p-4 z-40">
      <TextArea
        {...args}
        value={textValue}
        onChange={handleOnChange}
        variant={error ? 'failure' : args.variant}
        helperText={error ?? args.helperText}
      />
    </div>
  );
};

export const Story = Template.bind({});
Story.storyName = 'Default';
Story.parameters = { layout: 'fullscreen', ...designParameters };
Story.args = {
  placeholder: 'Puedes ingresar tus comentarios en el siguiente campo de texto',
  rows: 6
};

export const LimitedStory = Template.bind({});
LimitedStory.storyName = 'Character Limited';
LimitedStory.parameters = { layout: 'fullscreen', ...designParameters };
LimitedStory.args = {
  placeholder: 'Puedes ingresar tus comentarios en el siguiente campo de texto',
  rows: 6,
  maxLength: 5
};

export const WarningStory = Template.bind({});
WarningStory.storyName = 'Warning';
WarningStory.parameters = { layout: 'fullscreen', ...designParameters };
WarningStory.args = {
  placeholder: 'Puedes ingresar tus comentarios en el siguiente campo de texto',
  rows: 6,
  variant: 'warning',
  helperText: 'This is a warning message'
};

export const FailureStory = Template.bind({});
FailureStory.storyName = 'Failure';
FailureStory.parameters = { layout: 'fullscreen', ...designParameters };
FailureStory.args = {
  placeholder: 'Puedes ingresar tus comentarios en el siguiente campo de texto',
  rows: 6,
  variant: 'failure',
  helperText: 'This is an error message'
};

export const SuccessStory = Template.bind({});
SuccessStory.storyName = 'Success';
SuccessStory.parameters = { layout: 'fullscreen', ...designParameters };
SuccessStory.args = {
  placeholder: 'Puedes ingresar tus comentarios en el siguiente campo de texto',
  rows: 6,
  variant: 'success',
  helperText: 'This is a success message'
};

export const DisabledStory = Template.bind({});
DisabledStory.storyName = 'Disabled';
DisabledStory.parameters = { layout: 'fullscreen', ...designParameters };
DisabledStory.args = {
  placeholder: 'Puedes ingresar tus comentarios en el siguiente campo de texto',
  rows: 6,
  helperText: 'This is a helper text',
  disabled: true,
  maxLength: 140
};

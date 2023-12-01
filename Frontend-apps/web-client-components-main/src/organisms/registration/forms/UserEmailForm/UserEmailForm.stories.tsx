import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import UserEmailForm from './UserEmailForm';

export default {
  title: 'Organisms/Registration/Forms/User - 1 - Email and RUT',
  component: UserEmailForm
} as ComponentMeta<typeof UserEmailForm>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2831-148008&t=Qa8GEBOqFNKBMeta-4'
  }
};

const Template: ComponentStory<typeof UserEmailForm> = (args) => {
  return (
    <div className="tablet:w-[325px] tablet:m-auto">
      <UserEmailForm {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.args = {
  onSubmit: async (values) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(values);
      }, 3000)
    );
  }
};

export const ReadOnly = Template.bind({});
ReadOnly.parameters = designParameters;
ReadOnly.args = {
  readOnly: true
};

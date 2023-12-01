import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import ChangePasswordForm from './ChangePasswordForm';
export default {
  title: 'Organisms/Registration/Forms/Change password form',
  component: ChangePasswordForm
} as ComponentMeta<typeof ChangePasswordForm>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=4195-315471&mode=design&t=dgM4qFcjxEVGN4iA-4'
  }
};

const Template: ComponentStory<typeof ChangePasswordForm> = (args) => {
  return (
    <div className="tablet:w-[320px] tablet:m-auto">
      <ChangePasswordForm {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.storyName = 'Change Password Form';
Default.args = {
  onSubmit: async (values) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        console.log(values);
        resolve(values);
      }, 1000)
    );
  }
};

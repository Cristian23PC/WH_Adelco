import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import PasswordRecoveryForm from './PasswordRecoveryForm';
export default {
  title: 'Organisms/Registration/Forms/Password Recovery Form',
  component: PasswordRecoveryForm
} as ComponentMeta<typeof PasswordRecoveryForm>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=3979-149026&mode=design&t=Zl4SR1j9CsXXvkYd-4'
  }
};

const Template: ComponentStory<typeof PasswordRecoveryForm> = (args) => {
  return (
    <div className="tablet:w-[442px] desktop:w-[468px] tablet:m-auto">
      <PasswordRecoveryForm {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.storyName = 'Password Recovery Form';
Default.args = {
  onBack: () => {
    console.log('onBack');
  },
  onSubmit: console.log
};

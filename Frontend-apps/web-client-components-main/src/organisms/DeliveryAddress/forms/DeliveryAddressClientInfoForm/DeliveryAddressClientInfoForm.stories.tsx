import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import DeliveryAddressClientInfoForm from './DeliveryAddressClientInfoForm';

export default {
  title:
    'Organisms/Delivery Address/Forms/Delivery Address - Step 2 - DeliveryAddressClientInfoForm',
  component: DeliveryAddressClientInfoForm
} as ComponentMeta<typeof DeliveryAddressClientInfoForm>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=11368-671964&mode=design&t=J4sSJoPINaT4UjGb-0'
  }
};

const Template: ComponentStory<typeof DeliveryAddressClientInfoForm> = (
  args
) => {
  return <DeliveryAddressClientInfoForm {...args} />;
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.args = {
  onSubmit: async (values) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        alert('submit');
        resolve(values);
      }, 3000)
    );
  },
  onBack: () => {
    alert('go back');
  }
};
Default.storyName = 'Delivery Address - Step 2 - DeliveryAddressClientInfoForm';

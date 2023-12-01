import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';

import ConfirmationBusinessInformationForm from './ConfirmationBusinessInformationForm';

export default {
  title: 'Organisms/Registration/Forms/Business - Step 3 - Confirmation',
  component: ConfirmationBusinessInformationForm
} as ComponentMeta<typeof ConfirmationBusinessInformationForm>;

const mockSteps = [
  { title: 'Información de negocios', step: 1 },
  { title: 'Información de facturación', step: 2 },
  { title: 'Confirmación', step: 3 }
];

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-143672&t=oPb8oEwyh1QEX2Tu-4'
  }
};

const Template: ComponentStory<typeof ConfirmationBusinessInformationForm> = (
  args
) => {
  return (
    <div className="tablet:w-[442px] desktop:w-[468px] tablet:m-auto">
      <ConfirmationBusinessInformationForm {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.storyName = 'Business - Step 3 - Confirmation';
Default.args = {
  steps: mockSteps,
  customerInformation: {
    name: 'Marcelo Heriberto Solis Arenas',
    email: 'marcelosolis@gmail.com',
    phone: '+56 0 0320 8891'
  },
  billingAddress: {
    region: 'Región Metropolitana',
    commune: 'La Florida',
    street: 'Juan Pablo II',
    number: '8290'
  }
};

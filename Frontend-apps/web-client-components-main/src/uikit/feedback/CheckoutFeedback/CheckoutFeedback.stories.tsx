import React from 'react';
import { type Story, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import CheckoutFeedback, { type Props } from './CheckoutFeedback';

export default {
  title: 'UI Kit/Feedback/CheckoutFeedback',
  component: CheckoutFeedback,
  decorators: [withDesign]
} as ComponentMeta<typeof CheckoutFeedback>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=5312-18916&mode=dev'
  }
};

const Template: Story<Props> = (args) => (
  <div className="w-[288px] tablet:w-[688px] desktop:w-[886px]">
    <CheckoutFeedback {...args} />
  </div>
);

export const Display = Template.bind({});
Display.storyName = 'info';
Display.args = {
  title: 'Despacho gratis',
  message: 'Monto mínimo de compra $50.000',
  variant: 'info'
};
Display.parameters = designParameters;

export const Success = Template.bind({});
Success.storyName = 'Success';
Success.args = {
  message: 'Despacho gratis',
  variant: 'success'
};
Success.parameters = designParameters;

export const Error = Template.bind({});
Error.storyName = 'Error';
Error.args = {
  message: 'Aún no cumples el monto mínimo decompra ($50.000)',
  variant: 'error'
};
Error.parameters = designParameters;

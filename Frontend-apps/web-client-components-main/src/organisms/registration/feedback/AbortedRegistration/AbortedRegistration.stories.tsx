import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import AbortedRegistration, { type BenefitType } from './AbortedRegistration';

export default {
  title: 'Organisms/Registration/Feedback/Aborted Registration',
  component: AbortedRegistration,
  decorators: [withDesign]
} as ComponentMeta<typeof AbortedRegistration>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=4195-307002&t=bZRvFAp1mKkKeACR-4'
  }
};

const Template: ComponentStory<typeof AbortedRegistration> = (args) => (
  <AbortedRegistration {...args} />
);

const benefits: BenefitType[] = [
  {
    iconName: 'sales_outline',
    message: 'Podrás ver precios personalizados para tu negocio'
  },
  {
    iconName: 'delivery',
    message: 'Despacho gratis al comprar sobre nuestro pedido mínimo'
  },
  {
    iconName: 'customized_atention',
    message: 'Atención personalizada por parte de nuestro equipo de ventas'
  }
];

export const Default = Template.bind({});
Default.storyName = 'Aborted Registration';
Default.parameters = { layout: 'fullscreen', ...designParameters };
Default.args = {
  benefits
};

import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import UserEmailPasswordForm, { type Values } from './UserEmailPasswordForm';

export default {
  title: 'Organisms/Registration/Forms/User - 2 - Password',
  component: UserEmailPasswordForm
} as ComponentMeta<typeof UserEmailPasswordForm>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=2768-141753&t=g5D8zn2G7UEqyiZk-4'
  }
};

const defaultValues: Values = {
  username: 'foo@bar.com',
  firstName: 'foo',
  phone: '+54 666666666',
  surname: 'bar',
  rut: '194398158',
  razonSocial: 'Comercial El Arbol SpA'
};

const Template: ComponentStory<typeof UserEmailPasswordForm> = (args) => {
  return (
    <div className="tablet:w-[325px] tablet:m-auto">
      <UserEmailPasswordForm {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.parameters = designParameters;
Default.args = {
  defaultValues,
  giroOptions: [
    { value: 'food', label: 'Alimentos y comestibles' },
    { value: 'services', label: 'Servicios mayoristas' }
  ],
  onSubmit: async (values) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(values);
      }, 3000)
    );
  }
};

export const WithoutGiro = Template.bind({});
WithoutGiro.parameters = designParameters;
WithoutGiro.args = {
  defaultValues,
  giroOptions: []
};

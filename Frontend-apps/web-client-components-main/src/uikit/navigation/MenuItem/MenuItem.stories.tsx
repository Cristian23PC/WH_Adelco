import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import MenuItem from './MenuItem';
import MenuItemOption from './MenuItemOption';

export default {
  title: 'Ui Kit/Navigation/MenuItem',
  component: MenuItem,
  decorators: [withDesign],
  argTypes: {
    children: {
      table: {
        type: {
          summary: 'React.ReactNode | React.ReactNode[]'
        }
      }
    }
  }
} as ComponentMeta<typeof MenuItem>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/J1KIL9QYoFafGo20Cu14yY/Management-Website?type=design&node-id=1092-37004&mode=design&t=uNDoqxKvZP3FSSJ5-0'
  }
};

const Template: ComponentStory<typeof MenuItem> = (args) => (
  <div className="w-[285px]">
    <MenuItem {...args} />
  </div>
);

export const Active = Template.bind({});
Active.args = {
  active: true,
  label: 'Clientes',
  iconName: 'store_front'
};
Active.parameters = designParameters;

export const NonActive = Template.bind({});
NonActive.args = {
  active: false,
  label: 'Territorios',
  iconName: 'person_pin_circle'
};
NonActive.parameters = designParameters;

export const ActiveWithOptions = Template.bind({});
ActiveWithOptions.args = {
  active: true,
  label: 'Entidades de venta',
  iconName: 'work_outline',
  children: [
    <MenuItemOption label="Zonas" active key={0} />,
    <MenuItemOption label="Sucursales" active={false} key={1} />,
    <MenuItemOption label="Área supervisada" active={false} key={2} />
  ]
};
ActiveWithOptions.parameters = designParameters;

export const NonActiveWithOptions = Template.bind({});
NonActiveWithOptions.args = {
  active: false,
  label: 'Entidades de venta',
  iconName: 'work_outline',
  children: [
    <MenuItemOption label="Zonas" active={false} key={0} />,
    <MenuItemOption label="Sucursales" active={false} key={1} />,
    <MenuItemOption label="Área supervisada" active={false} key={2} />
  ]
};
NonActiveWithOptions.parameters = designParameters;

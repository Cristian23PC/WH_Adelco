import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import MenuItemOption from './MenuItemOption';

export default {
  title: 'Ui Kit/Navigation/MenuItem/MenuItemOption',
  component: MenuItemOption,
  decorators: [withDesign]
} as ComponentMeta<typeof MenuItemOption>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/J1KIL9QYoFafGo20Cu14yY/Management-Website?type=design&node-id=1092-37004&mode=design&t=uNDoqxKvZP3FSSJ5-0'
  }
};

const Template: ComponentStory<typeof MenuItemOption> = (args) => (
  <div className="w-[285px]">
    <MenuItemOption {...args} />
  </div>
);

export const Active = Template.bind({});
Active.args = {
  active: true,
  label: 'Clientes'
};
Active.parameters = designParameters;

export const NonActive = Template.bind({});
NonActive.args = {
  active: false,
  label: 'Territorios'
};
NonActive.parameters = designParameters;

export const ItemOnClick = Template.bind({});
ItemOnClick.args = {
  active: false,
  label: 'Entidades de venta',
  onClick: () => {
    alert('on click');
  }
};
ItemOnClick.parameters = designParameters;

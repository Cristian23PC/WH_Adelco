import React, { useState } from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import LoginModal from './LoginModal';
import HomeTemplate from '../../utils/HomeTemplate';

export default {
  title: 'Organisms/LoginModal',
  component: LoginModal,
  decorators: [withDesign]
} as ComponentMeta<typeof LoginModal>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=835-68272&t=ZqaHGE9hI6lhQnXS-4'
  }
};

const Template: ComponentStory<typeof LoginModal> = (args) => (
  <LoginModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  open: true,
  onSubmit: async (values) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(values);
      }, 3000)
    );
  },
  linkRenderer: (link, label, target) => (
    <a data-testid="link-rendered" href={link} target={target}>
      {label}
    </a>
  ),
  registerLink: '/register',
  onClickInvitedLink: () => {
    console.log('Clicked on Ingresa como invitado');
  }
};
Default.parameters = { ...designParameters, layout: 'fullscreen' };

const HomeExampleTemplate: ComponentStory<typeof LoginModal> = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <HomeTemplate
      navBarProps={{
        onClickUser: () => {
          setIsOpen(true);
        }
      }}
    >
      <LoginModal
        {...args}
        open={isOpen}
        registerLink="/register"
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <div className="pt-8 text-center font-bold">
        Press user icon on Navbar to open LoginModal
      </div>
    </HomeTemplate>
  );
};

export const HomeExample = HomeExampleTemplate.bind({});
HomeExample.parameters = { layout: 'fullscreen' };
HomeExample.args = {
  linkRenderer: (link, label, target) => (
    <a data-testid="link-rendered" href={link} target={target}>
      {label}
    </a>
  ),
  registerLink: '/register',
  onClickInvitedLink: () => {
    console.log('Clicked on Ingresa como invitado');
  }
};

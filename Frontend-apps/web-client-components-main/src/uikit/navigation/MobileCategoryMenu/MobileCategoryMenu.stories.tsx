import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';

import { Button } from '../../actions/Button';
import { type LinkRenderer } from '../../../utils/types';
import MobileCategoryMenu from './MobileCategoryMenu';
import { menuDataMock } from '../CategoriesMenu/CategoriesMenuMocks';

export default {
  title: 'Ui Kit/Navigation/MobileCategoryMenu',
  component: MobileCategoryMenu
} as ComponentMeta<typeof MobileCategoryMenu>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Client-%5BEcommerce%5D?type=design&node-id=14127-321769&mode=design&t=EodzHzlOeuOx4AWz-4'
  },
  layout: 'fullscreen'
};

const linkRenderer: LinkRenderer = (link, label, target) => (
  <a href={link} target={target}>
    {label}
  </a>
);

const Template: ComponentStory<typeof MobileCategoryMenu> = (args) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(args.open);
  }, [args.open]);

  const toggleOpen = (): void => {
    setOpen(!open);
  };

  const onClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={toggleOpen} variant="tertiary" iconName="menu" />
      <MobileCategoryMenu
        {...args}
        open={open}
        linkRenderer={linkRenderer}
        menuData={menuDataMock}
        onClose={onClose}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  // title: 'Categorías',
  open: false,
  isLoggedIn: false,
  username: 'Manuel'
  // placement: 'left'
};
Default.parameters = designParameters;
Default.storyName = 'MobileCategoryMenu';

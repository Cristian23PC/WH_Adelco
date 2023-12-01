import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';

import CategoriesMenu from './CategoriesMenu';
import { Button } from '../../actions/Button';
import { type LinkRenderer } from '../../../utils/types';
import { type MenuItem } from './types';

export default {
  title: 'Ui Kit/Navigation/CategoriesMenu',
  component: CategoriesMenu
} as ComponentMeta<typeof CategoriesMenu>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/eJD3y3qutGC19zCuWZnXQh/Catalogo?node-id=1621-371017&t=Fj5EfDeojGUdcclf-4'
  }
};

const linkRenderer: LinkRenderer = (link, label, target) => (
  <a href={link} target={target}>
    {label}
  </a>
);
const menuData: MenuItem[] = [
  {
    title: 'Limpieza',
    children: [
      { title: 'Hogar limpieza', slug: '/path' },
      { title: 'Accesorios de aseo', slug: '/path' },
      { title: 'Papeles tisue', slug: '/path' },
      { title: 'Control plaga', slug: '/path' },
      { title: 'Cocina y baño', slug: '/path' },
      { title: 'Limpia pisos y muebles', slug: '/path' },
      { title: 'Cuidado ropa', slug: '/path' },
      { title: 'Ver todo limpieza', slug: '/path' }
    ]
  },
  {
    title: 'Mascotas',
    children: [
      { title: 'Menu 2.1', children: [{ title: 'Menu 2.1.1', slug: '/path' }] },
      { title: 'Menu 2.2', slug: '/path' }
    ]
  },
  {
    title: 'Despensa',
    children: [
      { title: 'Menu 3.1', slug: '/path' },
      { title: 'Menu 3.2', slug: '/path' }
    ]
  },
  {
    title: 'Ferretería y automotriz',
    children: [
      { title: 'Menu 4.1', slug: '/path' },
      { title: 'Menu 4.2', slug: '/path' }
    ]
  },
  {
    title: 'Lacteos, refrigerados y huevos',
    children: [
      { title: 'Menu 5.1', slug: '/path' },
      { title: 'Menu 5.2', slug: '/path' }
    ]
  },
  { title: 'Perfumería', slug: '/path' }
];

const Template: ComponentStory<typeof CategoriesMenu> = (args) => {
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
      <CategoriesMenu
        {...args}
        linkRenderer={linkRenderer}
        menuData={menuData}
        onClose={onClose}
        open={open}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Categorías',
  open: false,
  placement: 'left'
};
Default.parameters = designParameters;
Default.storyName = 'CategoriesMenu';

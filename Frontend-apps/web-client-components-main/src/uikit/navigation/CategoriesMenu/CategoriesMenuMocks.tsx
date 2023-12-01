import React from 'react';
import { type LinkRenderer } from '../../../utils/types';

export const menuDataMock = [
  {
    title: 'Limpieza',
    slug: '/categoria/limpieza-C1010300',
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
    slug: '/categoria/mascotas-C1010340',
    children: [
      { title: 'Menu 2.1', children: [{ title: 'Menu 2.1.1', slug: '/path' }] },
      { title: 'Menu 2.2', slug: '/path' }
    ]
  },
  {
    title: 'Despensa',
    slug: 'despensa-C1010310',
    children: [
      { title: 'Menu 3.1', slug: '/path' },
      { title: 'Menu 3.2', slug: '/path' }
    ]
  },
  {
    title: 'Bebé y niños',
    slug: 'bebe-y-ninos-C1010380',
    children: [
      { title: 'Menu 4.1', slug: '/path' },
      { title: 'Menu 4.2', slug: '/path' }
    ]
  },
  {
    title: 'Desayuno y dulces',
    slug: 'desayuno-y-dulces-C1010320',
    children: [
      { title: 'Menu 5.1', slug: '/path' },
      { title: 'Menu 5.2', slug: '/path' }
    ]
  },
  { title: 'Perfumería', slug: 'perfumeria-C1010350' }
];

export const linkRendererMock: LinkRenderer = (link, label, target) => (
  <a key={link} href={link} target={target}>
    {label}
  </a>
);

/* istanbul ignore file */
import React from 'react';
import { type LinkRenderer } from '../../../utils/types';

export const mockCategoryList = [
  {
    title: 'Comida',
    count: 17,
    categories: [
      { title: 'Lácteos', slug: 'slug-11', count: 7, active: false },
      { title: 'Desayuno', slug: 'slug-12', count: 7, active: false },
      { title: 'Vegana', slug: 'slug-13', count: 3, active: false }
    ]
  },
  {
    title: 'Limpieza',
    count: 39,
    categories: [
      { title: 'Hogar limpieza', slug: 'slug-21', count: 7, active: true },
      { title: 'Accesorios de aseo', slug: 'slug-22', count: 7, active: false },
      { title: 'Papeles tissue', slug: 'slug-23', count: 3, active: false },
      { title: 'Control plaga', slug: 'slug-24', count: 4, active: false },
      { title: 'Cocina y baño', slug: 'slug-25', count: 2, active: false },
      {
        title: 'Limpia pisos y muebles',
        slug: 'slug-6',
        count: 4,
        active: false
      },
      { title: 'Cuidado ropa', slug: 'slug-7', count: 12, active: false }
    ]
  }
];

export const mockFilterList = {
  title: 'Filtrar productos',
  filters: [
    {
      slug: 'tipo-de-producto',
      title: 'Tipo de producto',
      options: [
        { title: 'Producto1', slug: 'Producto-1', count: 7, active: true },
        { title: 'Producto2', slug: 'Producto-2', count: 18, active: true },
        { title: 'Producto3', slug: 'Producto-3', count: 11, active: false },
        { title: 'Producto4', slug: 'Producto-4', count: 2, active: false },
        { title: 'Producto5', slug: 'Producto-5', count: 1, active: false }
      ]
    },
    {
      slug: 'marca',
      title: 'Marca',
      options: [
        { title: 'Marca1', slug: 'Marca-1', count: 7, active: false },
        { title: 'Marca2', slug: 'Marca-2', count: 18, active: false },
        { title: 'Marca3', slug: 'Marca-3', count: 11, active: true },
        { title: 'Marca4', slug: 'Marca-4', count: 2, active: false },
        { title: 'Marca5', slug: 'Marca-5', count: 1, active: false }
      ]
    }
  ]
};

export const mockStockFilter = {
  slug: 'stock-filter',
  title: 'Productos con stock',
  active: true
};

export const defaultLiterals = {
  cleanButton: 'Limpiar',
  applyButton: 'Aplicar'
};

type LinkRendererGenerator = (onClick: (slug: string) => void) => LinkRenderer;
export const mockLinkRenderer: LinkRendererGenerator =
  // eslint-disable-next-line react/display-name
  (onClick) => (link, children) =>
    (
      <div
        key={link}
        onClick={() => {
          onClick(link);
        }}
      >
        {children}
      </div>
    );

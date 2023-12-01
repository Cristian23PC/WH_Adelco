import React from 'react';
import { Button } from '../../uikit';
import {
  linkRendererMock,
  menuDataMock
} from '../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';

const button = (
  <Button
    onClick={() => {}}
    variant="secondary"
    className="w-full"
    size="sm"
    iconName="person_pin_circle"
  >
    Ingresar Ubicación
  </Button>
);

export const searchboxProps = {
  lastSearched: ['Durex', 'Mate', 'Agua Mineral'],
  onSearch: () => {},
  onTypeSearch: () => {},
  placeholder: 'Busca en Adelco.cl',
  flyoutTitle: 'Búsquedas recientes'
};

export const tooltipProps = {
  message: 'Cuéntanos en que zona te encuentras para ver todos los precios.',
  ctaComponent: button,
  onClose: () => {}
};

export const menuProps = {
  menuData: menuDataMock,
  title: 'Categorías',
  linkRenderer: linkRendererMock
};

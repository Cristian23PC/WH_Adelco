import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MobileCategoryMenu from './MobileCategoryMenu';
import {
  linkRendererMock,
  menuDataMock
} from '../CategoriesMenu/CategoriesMenuMocks';
import * as useClickOutside from '../../../utils/hooks/useClickOutside';

describe('MobileCategoryMenu', () => {
  it('should render', () => {
    render(
      <MobileCategoryMenu
        open
        linkRenderer={linkRendererMock}
        menuData={[]}
        onClose={() => {}}
        onLogoutClick={() => {}}
      />
    );

    const categoryMenu = screen.getByTestId('adelco-mobile-category-menu');

    expect(categoryMenu).toBeInTheDocument();
  });

  it('Should positioning correctly when is open', () => {
    render(
      <MobileCategoryMenu
        open
        linkRenderer={linkRendererMock}
        menuData={[]}
        onClose={() => {}}
        onLogoutClick={() => {}}
      />
    );

    const categoryMenu = screen.getByTestId('adelco-mobile-category-menu');
    expect(categoryMenu).toHaveClass('left-0');
  });

  it('Should positioning correctly when is close', () => {
    render(
      <MobileCategoryMenu
        open={false}
        linkRenderer={linkRendererMock}
        menuData={[]}
        onClose={() => {}}
        onLogoutClick={() => {}}
      />
    );

    const categoryMenu = screen.getByTestId('adelco-mobile-category-menu');
    expect(categoryMenu).toHaveClass('-left-[110%]');
  });

  it('Should execute onClose when click on backdrop', () => {
    const onClose = jest.fn();
    render(
      <MobileCategoryMenu
        open
        linkRenderer={linkRendererMock}
        menuData={[]}
        onClose={onClose}
        onLogoutClick={() => {}}
      />
    );

    const backdrop = screen.getByTestId('adelco-backdrop');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('Should execute onClose when click outside', () => {
    jest.spyOn(useClickOutside, 'default').mockImplementation((_, fn) => {
      fn();
    });
    const onClose = jest.fn();
    render(
      <MobileCategoryMenu
        open
        linkRenderer={linkRendererMock}
        menuData={[]}
        onClose={onClose}
        onLogoutClick={() => {}}
      />
    );

    expect(onClose).toHaveBeenCalled();
  });

  it('Should render categories', async () => {
    render(
      <MobileCategoryMenu
        open
        linkRenderer={linkRendererMock}
        menuData={menuDataMock}
        onClose={() => {}}
        onLogoutClick={() => {}}
      />
    );

    const category = screen.getAllByText('Limpieza')[0];
    expect(category).toBeInTheDocument();
    const subcategory = screen.queryByText('Hogar limpieza');
    expect(subcategory).not.toBeInTheDocument();
    const category2 = screen.getAllByText('Mascotas')[0];
    expect(category2).toBeInTheDocument();

    fireEvent.click(category);
    expect(await screen.findByText('Hogar limpieza')).toBeInTheDocument();
  });

  it('Should categories render twice', () => {
    render(
      <MobileCategoryMenu
        open
        linkRenderer={linkRendererMock}
        menuData={menuDataMock}
        onClose={() => {}}
        onLogoutClick={() => {}}
      />
    );

    const category1 = screen.getAllByText('Limpieza');
    const category2 = screen.getAllByText('Mascotas');

    expect(category1).toHaveLength(2);
    expect(category2).toHaveLength(2);
  });

  it('should render promotional banners', () => {
    render(
      <MobileCategoryMenu
        open
        linkRenderer={linkRendererMock}
        menuData={menuDataMock}
        onClose={() => {}}
        onLogoutClick={() => {}}
        promotionalBanners={[
          {
            imageURL: 'some image',
            link: '/'
          },
          {
            imageURL: 'another image',
            link: '/'
          }
        ]}
      />
    );

    const banners = screen.getAllByTestId('adelco-promotional-banner');
    expect(banners).toHaveLength(2);
  });
});

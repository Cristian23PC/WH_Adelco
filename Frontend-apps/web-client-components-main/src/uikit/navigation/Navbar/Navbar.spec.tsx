import React from 'react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act
} from '@testing-library/react';
import Navbar from './Navbar';
import {
  linkRendererMock,
  menuDataMock
} from '../CategoriesMenu/CategoriesMenuMocks';
import * as useScreen from '../../../utils/hooks/useScreen/useScreen';

describe('Navbar', () => {
  const searchboxProps = {
    lastSearched: ['Durex', 'Mate', 'Agua Mineral'],
    onSearch: () => {},
    onTypeSearch: () => {},
    placeholder: 'Busca en Adelco.cl',
    flyoutTitle: 'Búsquedas recientes'
  };

  const menuProps = {
    menuData: menuDataMock,
    title: 'Categorías',
    linkRenderer: linkRendererMock
  };
  const userMenuProps = {
    open: false,
    username: 'John Doe',
    linkRenderer: linkRendererMock,
    onClose: jest.fn(),
    onClickMyAccount: jest.fn(),
    onLogout: jest.fn()
  };
  beforeEach(() => {
    cleanup();
  });
  it('should render with correct passed data-testid', async () => {
    const dataTestId = 'navbar-component';
    render(
      <Navbar
        linkRenderer={linkRendererMock}
        menuProps={menuProps}
        data-testid={dataTestId}
        searchboxProps={searchboxProps}
        userMenuProps={userMenuProps}
        onRegisterClick={() => null}
        zoneLabel="Zone test"
      />
    );
    const navbar = await screen.findByTestId(dataTestId);
    expect(navbar).toBeInTheDocument();
  });
  describe('Zone part', () => {
    it('should render with correct zoneLabel', async () => {
      render(
        <Navbar
          linkRenderer={linkRendererMock}
          menuProps={menuProps}
          searchboxProps={searchboxProps}
          userMenuProps={userMenuProps}
          onRegisterClick={() => null}
          zoneLabel="Zone test"
        />
      );
      const zoneSection = await screen.findAllByText('Zone test');
      expect(zoneSection[0]).toBeInTheDocument();
    });
  });
  describe('searchbox part', () => {
    it('should display backdrop when open search flyout', async () => {
      render(
        <Navbar
          linkRenderer={linkRendererMock}
          menuProps={menuProps}
          searchboxProps={searchboxProps}
          userMenuProps={userMenuProps}
          onRegisterClick={() => null}
        />
      );
      const input = await screen.findAllByTestId('adelco-searchbox');
      expect(input[0]).toBeInTheDocument();
      fireEvent.focus(input[0]);
      const backdropElement = await screen.findByTestId('adelco-backdrop');
      expect(backdropElement).toBeInTheDocument();
    });
  });
  describe('CategoriesMenu part', () => {
    it('Should render CategoriesMenu desktop when button is clicked', async () => {
      jest.spyOn(useScreen, 'default').mockImplementation(() => ({
        isDesktop: true,
        isMobile: false,
        isTablet: false
      }));
      render(
        <Navbar
          linkRenderer={linkRendererMock}
          menuProps={menuProps}
          searchboxProps={searchboxProps}
          userMenuProps={userMenuProps}
          onRegisterClick={() => null}
        />
      );
      const button = await screen.findAllByRole('button');
      expect(button[0]).toBeInTheDocument();
      expect(screen.queryByTestId('categories-menu')).not.toBeInTheDocument();
      fireEvent.click(button[0]);
      const menu = await screen.findByTestId('categories-menu');
      expect(menu).toBeInTheDocument();
    });
    it('Should render CategoriesMenu mobile when button is clicked', async () => {
      jest.spyOn(useScreen, 'default').mockImplementation(() => ({
        isDesktop: false,
        isMobile: true,
        isTablet: false
      }));
      render(
        <Navbar
          linkRenderer={linkRendererMock}
          menuProps={menuProps}
          searchboxProps={searchboxProps}
          userMenuProps={userMenuProps}
          onRegisterClick={() => null}
        />
      );
      const button = await screen.findAllByRole('button');
      expect(button[0]).toBeInTheDocument();
      fireEvent.click(button[0]);
      expect(screen.queryByTestId('categories-menu')).not.toBeInTheDocument();
      const menu = await screen.findByTestId('adelco-mobile-category-menu');
      expect(menu).toBeInTheDocument();
    });
  });
  describe('UserMenu part', () => {
    it('should call the clickUser fn if not logged in', async () => {
      const clickUserAction = jest.fn();
      await act(async () => {
        render(
          <Navbar
            linkRenderer={linkRendererMock}
            menuProps={menuProps}
            searchboxProps={searchboxProps}
            userMenuProps={userMenuProps}
            onClickUser={clickUserAction}
            onRegisterClick={() => null}
          />
        );
      });
      fireEvent.click(screen.getByTestId('icon-person_outline'));
      expect(clickUserAction).toHaveBeenCalled();
    });

    it('should open the menu if logged in', async () => {
      await act(async () => {
        render(
          <Navbar
            linkRenderer={linkRendererMock}
            menuProps={menuProps}
            searchboxProps={searchboxProps}
            userMenuProps={userMenuProps}
            onRegisterClick={() => null}
            isLoggedIn={true}
          />
        );
      });
      const menu = screen.getByTestId('user-menu');
      expect(menu).toHaveClass('hidden');
      fireEvent.click(screen.getAllByTestId('icon-user_active')[0]);
      expect(menu).toHaveClass('block');
    });
  });
});

import React, { type FC } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UserNavbar, { type UserNavbarProps, DEFAULT_LITERALS } from './User';
import { linkRendererMock } from '../../../CategoriesMenu/CategoriesMenuMocks';
import * as useScreen from '../../../../../utils/hooks/useScreen';

jest.spyOn(useScreen, 'default').mockImplementation(() => ({
  isDesktop: true,
  isMobile: false,
  isTablet: false
}));

const onCloseAction = jest.fn();
const onClickMyAccountAction = jest.fn();
const onLogoutAction = jest.fn();
const onClickOpt = jest.fn();

const additionalOptions = [
  {
    label: 'Option 1',
    value: 'opt-1',
    onClick: onClickOpt
  },
  {
    label: 'Option 2',
    value: 'opt-2',
    onClick: onClickOpt
  }
];

const userMenuProps = {
  open: false,
  username: 'John Doe',
  linkRenderer: linkRendererMock,
  onClose: onCloseAction,
  onClickMyAccount: onClickMyAccountAction,
  onLogout: onLogoutAction,
  additionalOptions
};

const Component: FC<Partial<UserNavbarProps>> = (props) => (
  <UserNavbar
    literals={DEFAULT_LITERALS}
    searchboxProps={{ onSearch: jest.fn, onTypeSearch: jest.fn }}
    onClickUser={jest.fn}
    onClickCart={jest.fn}
    screenSize={{ isDesktop: true, isTablet: false, isMobile: false }}
    userMenuProps={userMenuProps}
    {...props}
  />
);

describe('UserNavbar', () => {
  it('should render user active if user isLoggedIn', async () => {
    await act(async () => {
      render(<Component isLoggedIn />);
    });

    const userButton = screen.getByTestId('icon-user_active');

    expect(userButton).toBeInTheDocument();
  });

  it('should call onClickUser when user button is clicked', async () => {
    const onClickUserFn = jest.fn();

    await act(async () => {
      render(<Component onClickUser={onClickUserFn} />);
    });

    const userButton = screen.getByTestId('icon-person_outline');
    fireEvent.click(userButton);

    expect(onClickUserFn).toHaveBeenCalledTimes(1);
  });

  it('should call onClickCart when cart button is clicked', async () => {
    const onClickCartFn = jest.fn();

    await act(async () => {
      render(<Component onClickCart={onClickCartFn} />);
    });

    const cartButton = screen.getByTestId('icon-shopping_cart');
    fireEvent.click(cartButton);

    expect(onClickCartFn).toHaveBeenCalledTimes(1);
  });

  it('should call onClickCart when cart mobile button is clicked', async () => {
    const onClickCartFn = jest.fn();

    await act(async () => {
      render(<Component onClickCart={onClickCartFn} />);
    });

    const cartButton = screen.getByTestId('icon-shopping_cart-mobile');
    fireEvent.click(cartButton);

    expect(onClickCartFn).toHaveBeenCalledTimes(1);
  });

  it('should render cart quantity if cartQuantity prop is provided', async () => {
    await act(async () => {
      render(<Component cartQuantity={5} />);
    });

    const cartQuantityElement = screen.getByText('5');

    expect(cartQuantityElement).toBeInTheDocument();
  });

  it('should render user menu if logged in', async () => {
    await act(async () => {
      render(<Component isLoggedIn={true} />);
    });
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  it('should call list functions', async () => {
    await act(async () => {
      render(<Component isLoggedIn={true} />);
    });
    const menu = screen.getByTestId('user-menu');
    const list = menu.querySelectorAll('li');
    expect(list.length).toBe(3);

    fireEvent.click(list[0]);
    expect(onClickOpt).toHaveBeenCalled();

    fireEvent.click(list[2]);
    expect(onLogoutAction).toHaveBeenCalled();
  });
});

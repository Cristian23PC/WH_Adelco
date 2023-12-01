/* eslint-disable */
import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import SimpleNavbar, { type Props } from './SimpleNavbar';
import { linkRendererMock } from '../CategoriesMenu/CategoriesMenuMocks';

const userClickAction = jest.fn();

const renderComponent = async (args: Props): Promise<void> => {
  await act(async () => {
    render(<SimpleNavbar {...args} />);
  });
};

describe('Simple Navbar', () => {
  const defaultArgs = {
    linkRenderer: linkRendererMock
  };
  it('should render the component', async () => {
    await renderComponent(defaultArgs);
    expect(screen.getByTestId('simple-navbar')).toBeInTheDocument();
  });
  it('should display the login button', async () => {
    await renderComponent({ ...defaultArgs, showLoginButton: true });
    expect(screen.getByTestId('icon-person_outline')).toBeInTheDocument();
  });
  it('should display the logo centered', async () => {
    await renderComponent({
      ...defaultArgs,
      showLoginButton: true,
      centered: true
    });
    const component = screen.getByTestId('simple-navbar');
    expect(component.querySelector('.mx-auto')).toBeInTheDocument();
    expect(component.querySelector('.pl-9')).toBeInTheDocument();
  });
  it('should call the click fn', async () => {
    await renderComponent({
      ...defaultArgs,
      showLoginButton: true,
      onClickUser: userClickAction
    });
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(userClickAction).toHaveBeenCalled();
  });
});

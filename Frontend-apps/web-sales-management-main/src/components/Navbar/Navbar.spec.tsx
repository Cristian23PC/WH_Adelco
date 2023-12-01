import { render, screen, act, fireEvent } from '@testing-library/react';
import Navbar, { NavbarProps } from './Navbar';
import { logout } from '@/api/Keycloak';

const mockUser = {
  name: 'foo',
  role: 'admin'
};

jest.mock('@/api/Keycloak', () => ({ logout: jest.fn() }));
jest.mock('@/hooks/auth/useAuthentication', () => () => ({ data: mockUser }));

const Component = (props: Partial<NavbarProps>) => <Navbar {...props} />;

describe('Navbar component', () => {
  describe('render', () => {
    it('should display the correct user name and role', async () => {
      await act(async () => {
        render(<Component />);
      });

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText('Administrador')).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should call logout on click Cerrar sesión', async () => {
      await act(async () => {
        render(<Component />);
      });

      fireEvent.click(screen.getByText('Cerrar sesión'));

      expect(logout).toHaveBeenCalled();
    });
  });
});

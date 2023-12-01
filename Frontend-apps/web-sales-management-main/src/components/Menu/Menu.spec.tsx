import { render, screen, act, fireEvent } from '@testing-library/react';
import Menu from './Menu';
import useAuthentication from '@/hooks/auth/useAuthentication';
import { Role } from '@/types/User';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/')
}));

jest.mock('@/hooks/auth/useAuthentication', () =>
  jest.fn(() => ({
    data: { role: Role.Admin }
  }))
);

const Component = () => <Menu />;

describe('Menu Component', () => {
  describe('render according to roles', () => {
    it('should render Menu items correctly as Admin', async () => {
      (useAuthentication as jest.Mock).mockImplementationOnce(() => ({
        data: { role: Role.Admin }
      }));
      await act(async () => {
        render(<Component />);
      });

      expect(screen.getByText('Usuarios')).toBeInTheDocument();
      expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
      expect(screen.queryByText('Territorios')).not.toBeInTheDocument();
      expect(screen.queryByText('Roles')).not.toBeInTheDocument();
      expect(screen.queryByText('Entidades de venta')).not.toBeInTheDocument();
      expect(screen.queryByText('Mapa de clientes')).not.toBeInTheDocument();
    });

    it('should render Menu items correctly as General Manager', async () => {
      (useAuthentication as jest.Mock).mockImplementationOnce(() => ({
        data: { role: Role.GeneralManager }
      }));
      await act(async () => {
        render(<Component />);
      });

      expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
      expect(screen.getByText('Clientes')).toBeInTheDocument();
      expect(screen.getByText('Territorios')).toBeInTheDocument();
      expect(screen.queryByText('Roles')).not.toBeInTheDocument();
      expect(screen.queryByText('Mapa de clientes')).not.toBeInTheDocument();

      const entityDropdown = screen.getByText('Entidades de venta');
      expect(entityDropdown).toBeInTheDocument();

      fireEvent.click(entityDropdown);

      expect(screen.getByText('Zonas')).toBeInTheDocument();
      expect(screen.getByText('Sucursales')).toBeInTheDocument();
      expect(screen.getByText('Áreas supervisadas')).toBeInTheDocument();
    });

    it('should render Menu items correctly as Zone Manager', async () => {
      (useAuthentication as jest.Mock).mockImplementationOnce(() => ({
        data: { role: Role.ZoneManager }
      }));
      await act(async () => {
        render(<Component />);
      });

      expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
      expect(screen.getByText('Clientes')).toBeInTheDocument();
      expect(screen.getByText('Territorios')).toBeInTheDocument();
      expect(screen.queryByText('Roles')).not.toBeInTheDocument();
      expect(screen.queryByText('Mapa de clientes')).not.toBeInTheDocument();

      const entityDropdown = screen.getByText('Entidades de venta');
      expect(entityDropdown).toBeInTheDocument();

      fireEvent.click(entityDropdown);

      expect(screen.queryByText('Zonas')).not.toBeInTheDocument();
      expect(screen.queryByText('Sucursales')).not.toBeInTheDocument();
      expect(screen.getByText('Áreas supervisadas')).toBeInTheDocument();
    });

    it('should render Menu items correctly as Supervisor', async () => {
      (useAuthentication as jest.Mock).mockImplementationOnce(() => ({
        data: { role: Role.Supervisor }
      }));
      await act(async () => {
        render(<Component />);
      });

      expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
      expect(screen.getByText('Clientes')).toBeInTheDocument();
      expect(screen.getByText('Territorios')).toBeInTheDocument();
      expect(screen.queryByText('Roles')).not.toBeInTheDocument();
      expect(screen.queryByText('Entidades de venta')).not.toBeInTheDocument();
      expect(screen.getByText('Mapa de clientes')).toBeInTheDocument();
    });

    it('should render Menu items correctly as Supervisor', async () => {
      (useAuthentication as jest.Mock).mockImplementationOnce(() => ({
        data: { role: Role.SalesRep }
      }));
      await act(async () => {
        render(<Component />);
      });

      expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
      expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
      expect(screen.queryByText('Territorios')).not.toBeInTheDocument();
      expect(screen.queryByText('Roles')).not.toBeInTheDocument();
      expect(screen.queryByText('Entidades de venta')).not.toBeInTheDocument();
      expect(screen.queryByText('Mapa de clientes')).not.toBeInTheDocument();
    });
  });
});

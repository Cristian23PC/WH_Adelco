import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BranchForm from './BranchForm';

const date = new Date();

jest.mock('@/hooks/zones/useGetZones', () =>
  jest.fn(() => ({
    zones: {
      results: [
        {
          name: 'Test Zone',
          zoneManager: {
            username: 'manager1',
            createdAt: date,
            updatedAt: date,
            firstName: 'manager',
            lastName: '1',
            role: '',
            status: ''
          },
          createdAt: date,
          deletedAt: date,
          updatedAt: date,
          id: 1,
          branchesCounter: 2
        },
        {
          name: 'Test Zone 2',
          zoneManager: {
            username: 'manager2',
            createdAt: date,
            updatedAt: date,
            firstName: 'manager',
            lastName: '2',
            role: '',
            status: ''
          },
          createdAt: date,
          deletedAt: date,
          updatedAt: date,
          id: 2,
          branchesCounter: 0
        }
      ]
    },
    isLoading: false,
    search: jest.fn()
  }))
);

const mockBranch = {
  id: 1,
  name: 'test branch',
  code: '0010',
  zone: {
    id: 10,
    name: 'test zone',
    zoneManagerId: 100
  },
  supervisedAreasCounter: 2
};

describe('BranchForm', () => {
  describe('create mode', () => {
    it('should render without errors', async () => {
      render(
        <BranchForm
          onSubmit={jest.fn()}
          onRemove={jest.fn()}
          onClose={jest.fn()}
          shouldValidateOnClose={false}
        />
      );

      const branchNameInput = screen.getByLabelText('Nombre de la sucursal');
      const branchCodeInput = screen.getByLabelText('Código de la sucursal');
      const zoneDropdownInput = screen.getAllByTestId('adelco-textfield')[2];

      expect(
        screen.getByRole('heading', { name: 'Crear sucursal' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Crear sucursal' })
      ).toBeInTheDocument();
      expect(branchNameInput).toBeInTheDocument();
      expect(branchCodeInput).toBeInTheDocument();
      expect(zoneDropdownInput).toBeInTheDocument();
    });

    it('should submit the form with valid data', async () => {
      const onSubmitMock = jest.fn();
      render(
        <BranchForm
          onSubmit={onSubmitMock}
          onRemove={jest.fn()}
          onClose={jest.fn()}
          shouldValidateOnClose={false}
        />
      );

      const branchNameInput = screen.getByLabelText('Nombre de la sucursal');
      const branchCodeInput = screen.getByLabelText('Código de la sucursal');
      const zoneDropdownInput = screen
        .getAllByTestId('adelco-textfield')[2]
        .getElementsByTagName('input')[0];
      const submitButton = screen.getByRole('button', {
        name: 'Crear sucursal'
      });
      expect(submitButton).toBeDisabled();

      userEvent.type(branchNameInput, 'Test Branch');
      userEvent.type(branchCodeInput, '0010');
      userEvent.type(zoneDropdownInput, 'Test');

      userEvent.click(screen.getByText('Test Zone 2'));

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({
          name: 'Test Branch',
          zoneId: '2',
          code: '0010'
        });
      });
    });

    it('should call onClose when shouldValidateOnClose is true', async () => {
      const onCloseMock = jest.fn();

      render(
        <BranchForm
          onSubmit={jest.fn()}
          onRemove={jest.fn()}
          onClose={onCloseMock}
          shouldValidateOnClose
        />
      );

      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledWith(false, {
        name: '',
        zoneId: '',
        code: ''
      });
    });
  });

  describe('edit mode', () => {
    it('renders without errors', async () => {
      render(
        <BranchForm
          onSubmit={jest.fn()}
          onRemove={jest.fn()}
          onClose={jest.fn()}
          shouldValidateOnClose={false}
          branch={mockBranch}
        />
      );
      const branchNameInput = screen.getByLabelText('Nombre de la sucursal');
      const branchCodeInput = screen.getByLabelText('Código de la sucursal');
      const zoneDropdownInput = screen.getAllByTestId('adelco-textfield')[1];

      expect(
        screen.getByRole('heading', { name: 'Información de la sucursal' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Eliminar sucursal' })
      ).toBeInTheDocument();
      expect(branchNameInput).toBeInTheDocument();
      expect(branchCodeInput).toBeInTheDocument();
      expect(zoneDropdownInput).toBeInTheDocument();
    });

    it('should submit the form with valid data', async () => {
      const onSubmitMock = jest.fn();
      render(
        <BranchForm
          onSubmit={onSubmitMock}
          onRemove={jest.fn()}
          onClose={jest.fn()}
          branch={mockBranch}
          shouldValidateOnClose={false}
        />
      );

      const branchNameInput = screen.getByLabelText('Nombre de la sucursal');
      userEvent.type(branchNameInput, ' edited');

      const submitButton = await screen.findByRole('button', {
        name: 'Guardar cambios'
      });

      expect(submitButton).toBeInTheDocument();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({
          name: 'test branch edited',
          zoneId: '10',
          code: '0010'
        });
      });
    });

    it('should call onRemove function', () => {
      const onRemoveMock = jest.fn();

      render(
        <BranchForm
          onSubmit={jest.fn()}
          onRemove={onRemoveMock}
          onClose={jest.fn()}
          shouldValidateOnClose={false}
          branch={mockBranch}
        />
      );

      const removeButton = screen.getByRole('button', {
        name: 'Eliminar sucursal'
      });
      expect(removeButton).toBeInTheDocument();

      userEvent.click(removeButton);

      expect(onRemoveMock).toHaveBeenCalledTimes(1);
    });
  });
});

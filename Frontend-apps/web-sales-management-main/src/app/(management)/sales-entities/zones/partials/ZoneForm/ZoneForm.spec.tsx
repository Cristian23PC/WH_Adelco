import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ZoneForm from './ZoneForm';
import { Role } from '@/types/User';

const users = [
  {
    firstName: 'Alice',
    lastName: 'Smith',
    username: 'alice.smith',
    role: Role.Admin,
    status: '',
    reportsTo: {
      createdAt: '',
      updatedAt: '',
      username: '',
      firstName: '',
      lastName: '',
      role: Role.Admin,
      status: ''
    },
    createdAt: '',
    updatedAt: ''
  }
];
jest.mock('@/hooks/users', () =>
  jest.fn(() => ({
    users,
    isLoading: false
  }))
);

const date = new Date();
const zone = {
  name: 'Test Zone',
  zoneManager: {
    username: 'alice.smith',
    createdAt: date,
    updatedAt: date,
    firstName: 'Alice',
    lastName: 'Smith',
    role: '',
    status: ''
  },
  createdAt: date,
  deletedAt: date,
  updatedAt: date,
  id: 1,
  branchesCounter: 2
};

describe('ZoneForm', () => {
  describe('create mode', () => {
    it('should render without errors', async () => {
      render(
        <ZoneForm
          onSubmit={jest.fn()}
          onRemove={jest.fn()}
          onClose={jest.fn()}
          shouldValidateOnClose={false}
        />
      );

      const zoneNameInput = screen.getByLabelText('Nombre de la zona');
      const managerDropdownInput = screen.getAllByTestId('adelco-textfield')[1];

      expect(
        screen.getByRole('heading', { name: 'Crear zona' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Crear zona' })
      ).toBeInTheDocument();
      expect(zoneNameInput).toBeInTheDocument();
      expect(managerDropdownInput).toBeInTheDocument();
    });

    it('should submit the form with valid data', async () => {
      const onSubmitMock = jest.fn();
      render(
        <ZoneForm
          onSubmit={onSubmitMock}
          onRemove={jest.fn()}
          onClose={jest.fn()}
          shouldValidateOnClose={false}
        />
      );

      const zoneNameInput = screen.getByLabelText('Nombre de la zona');
      const managerDropdownInput = screen
        .getAllByTestId('adelco-textfield')[1]
        .getElementsByTagName('input')[0];
      const submitButton = screen.getByRole('button', { name: 'Crear zona' });
      expect(submitButton).toBeDisabled();

      userEvent.type(zoneNameInput, 'Test Zone');
      userEvent.type(managerDropdownInput, 'Alice');
      userEvent.click(screen.getByText('Alice Smith'));

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
        expect(onSubmitMock).toHaveBeenCalledWith({
          name: 'Test Zone',
          zoneManagerId: 'alice.smith'
        });
      });
    });

    it('should call onClose when shouldValidateOnClose is true', async () => {
      const onCloseMock = jest.fn();

      render(
        <ZoneForm
          onSubmit={jest.fn()}
          onRemove={jest.fn()}
          onClose={onCloseMock}
          shouldValidateOnClose
        />
      );

      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledWith(false, {
        name: '',
        zoneManagerId: ''
      });
    });
  });

  describe('edit mode', () => {
    it('renders without errors', async () => {
      render(
        <ZoneForm
          onSubmit={jest.fn()}
          onRemove={jest.fn()}
          onClose={jest.fn()}
          shouldValidateOnClose={false}
          zone={zone}
        />
      );

      const zoneNameInput = screen.getByLabelText('Nombre de la zona');
      const managerDropdownInput = screen.getAllByTestId('adelco-textfield')[1];

      expect(
        screen.getByRole('heading', { name: 'Información de la zona' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Eliminar zona' })
      ).toBeInTheDocument();
      expect(zoneNameInput).toBeInTheDocument();
      expect(managerDropdownInput).toBeInTheDocument();
    });

    it('should submit the form with valid data', async () => {
      const onSubmitMock = jest.fn();
      render(
        <ZoneForm
          onSubmit={onSubmitMock}
          onRemove={jest.fn()}
          onClose={jest.fn()}
          zone={zone}
          shouldValidateOnClose={false}
        />
      );

      const zoneNameInput = screen.getByLabelText('Nombre de la zona');
      userEvent.type(zoneNameInput, ' edited');

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
          name: 'Test Zone edited',
          zoneManagerId: 'alice.smith'
        });
      });
    });

    it('should call onRemove function', () => {
      const onRemoveMock = jest.fn();

      render(
        <ZoneForm
          onSubmit={jest.fn()}
          onRemove={onRemoveMock}
          onClose={jest.fn()}
          shouldValidateOnClose={false}
          zone={zone}
        />
      );

      const removeButton = screen.getByRole('button', {
        name: 'Eliminar zona'
      });
      expect(removeButton).toBeInTheDocument();

      userEvent.click(removeButton);

      expect(onRemoveMock).toHaveBeenCalledTimes(1);
    });
  });
});

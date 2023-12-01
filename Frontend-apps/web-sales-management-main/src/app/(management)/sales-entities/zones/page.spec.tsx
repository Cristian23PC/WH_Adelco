import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Zones from './page';
import useGetZones from '@/hooks/zones/useGetZones';
import useCreateZone from '@/hooks/zones/useCreateZone';
import useEditZone from '@/hooks/zones/useEditZone';
import useRemoveZone from '@/hooks/zones/useRemoveZone';

// Mock the custom hooks
jest.mock('@/hooks/zones/useGetZones', () =>
  jest.fn(() => ({
    isLoading: false,
    zones: { results: [] },
    page: 1,
    setPage: jest.fn(),
    totalPages: 2
  }))
);
jest.mock('@/hooks/zones/useCreateZone', () =>
  jest.fn(() => ({
    createZone: jest.fn(),
    isLoading: false
  }))
);
jest.mock('@/hooks/zones/useEditZone', () =>
  jest.fn(() => ({
    editZone: jest.fn(),
    isLoading: false
  }))
);

jest.mock('@/hooks/zones/useRemoveZone', () =>
  jest.fn(() => ({
    removeZone: jest.fn(),
    isLoading: false
  }))
);

const mockUsers = [
  {
    firstName: 'Alice',
    lastName: 'Smith',
    username: 'alice.smith'
  }
];
jest.mock('@/hooks/users', () =>
  jest.fn(() => ({
    users: mockUsers,
    isLoading: false
  }))
);

const date = new Date();
const mockZones = [
  {
    name: 'Zone 1',
    zoneManager: {
      username: 'manager_one',
      createdAt: date,
      updatedAt: date,
      firstName: 'manager',
      lastName: 'one',
      role: '',
      status: ''
    },
    createdAt: date,
    deletedAt: date,
    updatedAt: date,
    id: 1,
    branchesCounter: 6
  }
];

describe('Zones', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a header wit create button and a loading spinner during data fetch', () => {
    (useGetZones as jest.Mock).mockReturnValueOnce({ isLoading: true });
    render(<Zones />);

    expect(screen.getByTestId('adelco-spinner')).toBeInTheDocument();
    expect(screen.getByText('Zonas')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Crear Zona' })
    ).toBeInTheDocument();
  });

  it('should render zones table with data', () => {
    (useGetZones as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      zones: { results: mockZones },
      totalPages: 1,
      page: 1,
      setPage: jest.fn()
    });

    render(<Zones />);

    expect(screen.queryByTestId('adelco-spinner')).not.toBeInTheDocument();

    expect(screen.getByText('Zone 1')).toBeInTheDocument();
    expect(screen.getByText('manager one')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: 'Ver más'
      })[0]
    ).toBeInTheDocument();
  });

  it('should render no results message when there are no zones', async () => {
    render(<Zones />);

    await waitFor(() => {
      expect(
        screen.getByText('No se han encontrado resultados')
      ).toBeInTheDocument();
    });
  });

  it('should open create zone modal form and submit successfully', async () => {
    const { submitButton, createZoneMock } = await openAndFillCreateZoneModal();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(createZoneMock).toHaveBeenCalledTimes(1);
      expect(createZoneMock).toHaveBeenCalledWith({
        name: 'Test Zone',
        zoneManagerId: 'alice.smith'
      });
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('should open create zone modal form and throw an error after submit ', async () => {
    const { submitButton, createZoneMock } = await openAndFillCreateZoneModal(
      'Error creating zone'
    );

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(createZoneMock).toHaveBeenCalledTimes(1);
      expect(createZoneMock).toHaveBeenCalledWith({
        name: 'Test Zone',
        zoneManagerId: 'alice.smith'
      });
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('should open confirm discard change modal after close zone form and save shanges', async () => {
    const { createZoneMock, closeIcon } = await openAndFillCreateZoneModal();

    userEvent.click(closeIcon);

    const submitButton = screen.getByRole('button', {
      name: 'Guardar cambios'
    });

    expect(screen.getByText('Existen cambios sin guardar')).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(createZoneMock).toHaveBeenCalledTimes(1);
      expect(createZoneMock).toHaveBeenCalledWith({
        name: 'Test Zone',
        zoneManagerId: 'alice.smith'
      });
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('should open confirm discard change modal after close zone form and discard shanges', async () => {
    const { createZoneMock, closeIcon } = await openAndFillCreateZoneModal();

    userEvent.click(closeIcon);

    const onDiscardButton = screen.getByRole('button', {
      name: 'Descartar'
    });

    expect(screen.getByText('Existen cambios sin guardar')).toBeInTheDocument();
    expect(onDiscardButton).toBeInTheDocument();

    userEvent.click(onDiscardButton);

    expect(createZoneMock).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.queryByText('Existen cambios sin guardar')
      ).not.toBeInTheDocument();
    });
  });

  it('should open edit zone modal form and submit successfully', async () => {
    const { submitButton, editZoneMock } = await openAndFillEditZoneModal();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(editZoneMock).toHaveBeenCalledTimes(1);
      expect(editZoneMock).toHaveBeenCalledWith({
        id: 1,
        payload: { name: 'Zone 1 edited', zoneManagerId: 'manager_one' }
      });

      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('should open unable remove modal after click on remove zone', async () => {
    const { removeZoneButton } = await openViewZoneModal();

    userEvent.click(removeZoneButton);

    expect(screen.getByText('Eliminar entidad')).toBeInTheDocument();
    expect(
      screen.getByText('Esta zona tiene 6 sucursales asignadas.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Para eliminarla primero se deben desasignar las sucursales.'
      )
    ).toBeInTheDocument();
  });

  it('should open remove modal after click on remove zone and call remove the zone', async () => {
    const removeZoneMock = jest.fn();

    (useRemoveZone as jest.Mock).mockImplementation(({ onSuccess }) => ({
      removeZone: async (data: any) => {
        await removeZoneMock(data);
        onSuccess(data);
      },
      isLoading: true
    }));

    const { removeZoneButton } = await openViewZoneModal('', [
      { ...mockZones[0], branchesCounter: 0 }
    ]);

    userEvent.click(removeZoneButton);

    const submitButton = screen.getByRole('button', { name: 'Eliminar' });

    expect(screen.getByText('Eliminar entidad')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Si se elimina esta entidad, la acción no se podrá deshacer.'
      )
    ).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Mantener' })
    ).toBeInTheDocument();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(removeZoneMock).toHaveBeenCalledTimes(1);
      expect(removeZoneMock).toHaveBeenCalledWith(1);

      expect(submitButton).not.toBeInTheDocument();
    });
  });

  const openAndFillCreateZoneModal = async (error?: string) => {
    const createZoneMock = jest
      .fn()
      .mockImplementation((data) =>
        error ? Promise.reject(error) : Promise.resolve(data)
      );

    (useCreateZone as jest.Mock).mockImplementation(
      ({ onError, onSuccess }) => ({
        createZone: async (data: any) => {
          try {
            await createZoneMock(data);
            onSuccess(data);
          } catch {
            onError(error);
          }
        },
        isLoading: true
      })
    );

    render(<Zones />);

    userEvent.click(screen.getByRole('button', { name: 'Crear Zona' }));

    const zoneNameInput = screen.getByLabelText('Nombre de la zona');
    const managerDropdownInput = screen.getAllByTestId('adelco-textfield')[1];
    const submitButton = screen.getByTestId('adelco-zone-form-submit-button');
    const closeIcon = await screen.findByTestId('icon-close');

    expect(
      screen.getByRole('heading', { name: 'Crear zona' })
    ).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(zoneNameInput).toBeInTheDocument();
    expect(managerDropdownInput).toBeInTheDocument();

    userEvent.type(zoneNameInput, 'Test Zone');
    userEvent.type(managerDropdownInput, 'Alice');
    userEvent.click(screen.getByText('Alice Smith'));

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    return { submitButton, closeIcon, createZoneMock };
  };

  const openViewZoneModal = async (
    error?: string,
    getZonesMock = mockZones
  ) => {
    (useGetZones as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      zones: { results: getZonesMock },
      totalPages: 1,
      page: 1,
      setPage: jest.fn()
    });

    const editZoneMock = jest
      .fn()
      .mockImplementation((data) =>
        error ? Promise.reject(error) : Promise.resolve(data)
      );

    (useEditZone as jest.Mock).mockImplementation(({ onError, onSuccess }) => ({
      editZone: async (data: any) => {
        try {
          await editZoneMock(data);
          onSuccess(data);
        } catch {
          onError(error);
        }
      },
      isLoading: true
    }));

    render(<Zones />);

    userEvent.click(screen.getByRole('button', { name: 'Ver más' }));

    const zoneNameInput = screen.getByLabelText('Nombre de la zona');
    const managerDropdownInput = screen.getAllByTestId('adelco-textfield')[1];
    const closeIcon = await screen.findByTestId('icon-close');
    const removeZoneButton = screen.getByText('Eliminar zona');

    expect(
      screen.getByRole('heading', { name: 'Información de la zona' })
    ).toBeInTheDocument();
    expect(zoneNameInput).toBeInTheDocument();
    expect(managerDropdownInput).toBeInTheDocument();
    expect(removeZoneButton).toBeInTheDocument();

    return {
      zoneNameInput,
      managerDropdownInput,
      closeIcon,
      removeZoneButton,
      editZoneMock
    };
  };

  const openAndFillEditZoneModal = async (
    error?: string,
    getZonesMock = mockZones
  ) => {
    const {
      zoneNameInput,
      managerDropdownInput,
      closeIcon,
      editZoneMock,
      removeZoneButton
    } = await openViewZoneModal(error, getZonesMock);

    userEvent.type(zoneNameInput, ' edited');
    userEvent.tab();

    const submitButton = await screen.findByRole('button', {
      name: 'Guardar cambios'
    });

    return {
      zoneNameInput,
      managerDropdownInput,
      submitButton,
      closeIcon,
      removeZoneButton,
      editZoneMock
    };
  };
});

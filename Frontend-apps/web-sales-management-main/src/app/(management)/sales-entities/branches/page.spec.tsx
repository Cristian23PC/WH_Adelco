import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Branches from './page';
import useCreateBranch from '@/hooks/branches/useCreateBranch';
import useEditBranch from '@/hooks/branches/useEditBranch';
import useGetBranches from '@/hooks/branches/useGetBranches';
import useRemoveBranch from '@/hooks/branches/useRemoveBranch';

const date = new Date();
// Mock the custom hooks
jest.mock('@/hooks/branches/useGetBranches', () =>
  jest.fn(() => ({
    isLoading: false,
    branches: [],
    page: 1,
    setPage: jest.fn(),
    totalPages: 2
  }))
);
jest.mock('@/hooks/branches/useCreateBranch', () =>
  jest.fn(() => ({
    createBranch: jest.fn(),
    isLoading: false
  }))
);
jest.mock('@/hooks/branches/useEditBranch', () =>
  jest.fn(() => ({
    editBranch: jest.fn(),
    isLoading: false
  }))
);

jest.mock('@/hooks/branches/useRemoveBranch', () =>
  jest.fn(() => ({
    removeBranch: jest.fn(),
    isLoading: false
  }))
);

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
    search: jest.fn(),
    page: 1,
    setPage: jest.fn(),
    totalPages: 2
  }))
);

const mockBranches = [
  {
    id: 1,
    name: 'test branch',
    code: '0010',
    zone: {
      id: 10,
      name: 'test zone',
      zoneManagerId: 100
    },
    supervisedAreasCounter: 2
  }
];

describe('Branches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a header with create button and a loading spinner during data fetch', () => {
    (useGetBranches as jest.Mock).mockReturnValueOnce({ isLoading: true });
    render(<Branches />);

    expect(screen.getByTestId('adelco-spinner')).toBeInTheDocument();
    expect(screen.getByText('Sucursales')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Crear sucursal' })
    ).toBeInTheDocument();
  });

  it('should render branches table with data', () => {
    (useGetBranches as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      branches: mockBranches,
      totalPages: 1,
      page: 1,
      setPage: jest.fn()
    });

    render(<Branches />);

    expect(screen.queryByTestId('adelco-spinner')).not.toBeInTheDocument();

    expect(screen.getByText('test branch')).toBeInTheDocument();
    expect(screen.getByText('test zone')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: 'Ver más'
      })[0]
    ).toBeInTheDocument();
  });

  it('should render no results message when there are no branches', async () => {
    render(<Branches />);

    await waitFor(() => {
      expect(
        screen.getByText('No se han encontrado resultados')
      ).toBeInTheDocument();
    });
  });

  it('should open create branch modal form and submit successfully', async () => {
    const { submitButton, createBranchMock } =
      await openAndFillCreateBranchModal();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(createBranchMock).toHaveBeenCalledTimes(1);
      expect(createBranchMock).toHaveBeenCalledWith({
        name: 'Test Branch',
        zoneId: 2,
        code: '0010'
      });
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('should open create branch modal form and throw an error after submit ', async () => {
    const { submitButton, createBranchMock } =
      await openAndFillCreateBranchModal('Error creating branch');

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(createBranchMock).toHaveBeenCalledTimes(1);
      expect(createBranchMock).toHaveBeenCalledWith({
        name: 'Test Branch',
        zoneId: 2,
        code: '0010'
      });
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('should open confirm discard change modal after close branch form and save shanges', async () => {
    const { createBranchMock, closeIcon } =
      await openAndFillCreateBranchModal();

    userEvent.click(closeIcon);

    const submitButton = screen.getByRole('button', {
      name: 'Guardar cambios'
    });

    expect(screen.getByText('Existen cambios sin guardar')).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(createBranchMock).toHaveBeenCalledTimes(1);
      expect(createBranchMock).toHaveBeenCalledWith({
        name: 'Test Branch',
        zoneId: 2,
        code: '0010'
      });
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('should open confirm discard change modal after close branch form and discard shanges', async () => {
    const { createBranchMock, closeIcon } =
      await openAndFillCreateBranchModal();

    userEvent.click(closeIcon);

    const onDiscardButton = screen.getByRole('button', {
      name: 'Descartar'
    });

    expect(screen.getByText('Existen cambios sin guardar')).toBeInTheDocument();
    expect(onDiscardButton).toBeInTheDocument();

    userEvent.click(onDiscardButton);

    expect(createBranchMock).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.queryByText('Existen cambios sin guardar')
      ).not.toBeInTheDocument();
    });
  });

  it('should open edit zone modal form and submit successfully', async () => {
    const { submitButton, editBranchMock } = await openAndFillEditBranchModal();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(editBranchMock).toHaveBeenCalledTimes(1);
      expect(editBranchMock).toHaveBeenCalledWith({
        id: 1,
        payload: { name: 'test branch edited', zoneId: 10, code: '0010' }
      });

      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('should open unable remove modal after click on remove branch', async () => {
    const { removeBranchButton } = await openViewBranchModal();

    userEvent.click(removeBranchButton);

    expect(screen.getByText('Eliminar entidad')).toBeInTheDocument();
    expect(
      screen.getByText('Esta sucursal tiene 2 áreas supervisadas asignadas.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Para eliminarla primero se deben desasignar las áreas supervisadas.'
      )
    ).toBeInTheDocument();
  });

  it('should open remove modal after click on remove branch and call remove branch function', async () => {
    const removeBranchMock = jest.fn();

    (useRemoveBranch as jest.Mock).mockImplementation(({ onSuccess }) => ({
      removeBranch: async (data: any) => {
        await removeBranchMock(data);
        onSuccess(data);
      },
      isLoading: true
    }));

    const { removeBranchButton } = await openViewBranchModal('', [
      { ...mockBranches[0], supervisedAreasCounter: 0 }
    ]);

    userEvent.click(removeBranchButton);

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
      expect(removeBranchMock).toHaveBeenCalledTimes(1);
      expect(removeBranchMock).toHaveBeenCalledWith(1);

      expect(submitButton).not.toBeInTheDocument();
    });
  });

  const openAndFillCreateBranchModal = async (error?: string) => {
    const createBranchMock = jest
      .fn()
      .mockImplementation((data) =>
        error ? Promise.reject(error) : Promise.resolve(data)
      );

    (useCreateBranch as jest.Mock).mockImplementation(
      ({ onError, onSuccess }) => ({
        createBranch: async (data: any) => {
          try {
            await createBranchMock(data);
            onSuccess(data);
          } catch {
            onError(error);
          }
        },
        isLoading: true
      })
    );

    render(<Branches />);

    userEvent.click(screen.getByRole('button', { name: 'Crear sucursal' }));

    const branchNameInput = screen.getByLabelText('Nombre de la sucursal');
    const branchCodeInput = screen.getByLabelText('Código de la sucursal');
    const zoneDropdownInput = screen.getAllByTestId('adelco-textfield')[2];
    const submitButton = screen.getByTestId('adelco-zone-form-submit-button');
    const closeIcon = await screen.findByTestId('icon-close');

    expect(
      screen.getByRole('heading', { name: 'Crear sucursal' })
    ).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(branchNameInput).toBeInTheDocument();
    expect(branchCodeInput).toBeInTheDocument();
    expect(zoneDropdownInput).toBeInTheDocument();

    userEvent.type(branchNameInput, 'Test Branch');
    userEvent.type(branchCodeInput, '0010');
    userEvent.type(zoneDropdownInput, 'Test');

    userEvent.click(screen.getByText('Test Zone 2'));

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    return { submitButton, closeIcon, createBranchMock };
  };

  const openViewBranchModal = async (
    error?: string,
    getBranchesMock = mockBranches
  ) => {
    (useGetBranches as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      branches: getBranchesMock,
      totalPages: 1,
      page: 1,
      setPage: jest.fn()
    });

    const editBranchMock = jest
      .fn()
      .mockImplementation((data) =>
        error ? Promise.reject(error) : Promise.resolve(data)
      );

    (useEditBranch as jest.Mock).mockImplementation(
      ({ onError, onSuccess }) => ({
        editBranch: async (data: any) => {
          try {
            await editBranchMock(data);
            onSuccess(data);
          } catch {
            onError(error);
          }
        },
        isLoading: true
      })
    );

    render(<Branches />);

    userEvent.click(screen.getByRole('button', { name: 'Ver más' }));

    const branchNameInput = screen.getByLabelText('Nombre de la sucursal');
    const branchCodeInput = screen.getByLabelText('Código de la sucursal');
    const zoneDropdownInput = screen.getAllByTestId('adelco-textfield')[2];
    const closeIcon = await screen.findByTestId('icon-close');
    const removeBranchButton = screen.getByText('Eliminar sucursal');

    expect(
      screen.getByRole('heading', { name: 'Información de la sucursal' })
    ).toBeInTheDocument();
    expect(branchNameInput).toBeInTheDocument();
    expect(branchCodeInput).toBeInTheDocument();
    expect(zoneDropdownInput).toBeInTheDocument();
    expect(removeBranchButton).toBeInTheDocument();

    return {
      branchNameInput,
      branchCodeInput,
      zoneDropdownInput,
      closeIcon,
      removeBranchButton,
      editBranchMock
    };
  };

  const openAndFillEditBranchModal = async (
    error?: string,
    getBranchesMock = mockBranches
  ) => {
    const {
      branchNameInput,
      branchCodeInput,
      zoneDropdownInput,
      closeIcon,
      removeBranchButton,
      editBranchMock
    } = await openViewBranchModal(error, getBranchesMock);

    userEvent.type(branchNameInput, ' edited');
    userEvent.tab();

    const submitButton = await screen.findByRole('button', {
      name: 'Guardar cambios'
    });

    return {
      branchNameInput,
      branchCodeInput,
      zoneDropdownInput,
      closeIcon,
      removeBranchButton,
      editBranchMock,
      submitButton
    };
  };
});

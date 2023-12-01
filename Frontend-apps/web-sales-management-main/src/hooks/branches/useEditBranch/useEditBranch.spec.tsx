import { renderHook, waitFor, act } from '@testing-library/react';
import useEditBranch from './useEditBranch';
import { editBranch } from '@/api/Branches';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from '@adelco/web-components';

jest.mock('@/api/Branches', () => ({
  editBranch: jest.fn()
}));

jest.mock('@adelco/web-components', () => ({
  ...jest.requireActual('@adelco/web-components'),
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('useEditBranch', () => {
  let queryClient: QueryClient;
  const editBranchData = {
    name: 'branch name',
    zoneId: 20,
    code: '0010'
  };

  beforeEach(() => {
    (editBranch as jest.Mock).mockResolvedValue(editBranchData);
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });
    jest.clearAllMocks();
  });

  it('should edit a branch and invalidate queries on success', async () => {
    const spyInvalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
    const mockOnSuccess = jest.fn();

    // Act
    const { result } = renderHook(
      () => useEditBranch({ onSuccess: mockOnSuccess }),
      {
        wrapper: ({ children }) => {
          return (
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          );
        }
      }
    );

    act(() => {
      result.current.editBranch({ payload: editBranchData, id: 1 });
    });

    await waitFor(() => {
      expect(editBranch).toHaveBeenCalledWith({
        payload: editBranchData,
        id: 1
      });

      expect(toast.success).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith({
        text: 'Sucursal modificada con éxito',
        iconName: 'done',
        position: 'top-right'
      });
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(editBranchData);
    });
    expect(spyInvalidateQueries).toHaveBeenCalledTimes(1);
    expect(spyInvalidateQueries).toHaveBeenCalledWith(['branches']);
  });

  it('should show an error toast when there is an error', async () => {
    const mockOnError = jest.fn();
    const mockErrorResponse = { statusCode: 404 };
    let error: Error | null = null;

    (editBranch as jest.Mock).mockImplementation(() =>
      Promise.reject(mockErrorResponse)
    );

    const { result } = renderHook(
      () => useEditBranch({ onError: mockOnError }),
      {
        wrapper: ({ children }) => {
          return (
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          );
        }
      }
    );

    act(async () => {
      try {
        await result.current.editBranch({ payload: editBranchData, id: 1 });
      } catch (e) {
        error = e as Error;
      }
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith({
        title: `Error al modificar la sucursal`,
        iconName: 'error',
        position: 'top-right',
        text: 'No se ha encontrado la zona'
      });

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(mockErrorResponse);
      expect(error).toStrictEqual(mockErrorResponse);
    });
  });
});

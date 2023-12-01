import { renderHook, waitFor, act } from '@testing-library/react';
import useRemoveBranch from './useRemoveBranch';
import { removeBranch } from '@/api/Branches';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from '@adelco/web-components';

jest.mock('@/api/Branches', () => ({
  removeBranch: jest.fn()
}));

jest.mock('@adelco/web-components', () => ({
  ...jest.requireActual('@adelco/web-components'),
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('useRemoveBranch', () => {
  let queryClient: QueryClient;
  const removeBranchId = 1;

  beforeEach(() => {
    (removeBranch as jest.Mock).mockResolvedValue(removeBranchId);
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });
    jest.clearAllMocks();
  });

  it('should create a zone and invalidate queries on success', async () => {
    const spyInvalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
    const mockOnSuccess = jest.fn();

    // Act
    const { result } = renderHook(
      () => useRemoveBranch({ onSuccess: mockOnSuccess }),
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
      result.current.removeBranch(removeBranchId);
    });

    await waitFor(() => {
      expect(removeBranch).toHaveBeenCalledWith(removeBranchId);

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(removeBranchId);
    });

    expect(spyInvalidateQueries).toHaveBeenCalledTimes(1);
    expect(spyInvalidateQueries).toHaveBeenCalledWith(['branches']);
  });

  it('should show an error toast when there is an error', async () => {
    const mockOnError = jest.fn();
    const mockErrorResponse = { statusCode: 404 };
    let error: Error | null = null;

    (removeBranch as jest.Mock).mockImplementation(() =>
      Promise.reject(mockErrorResponse)
    );

    const { result } = renderHook(
      () => useRemoveBranch({ onError: mockOnError }),
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
        await result.current.removeBranch(removeBranchId);
      } catch (e) {
        error = e as Error;
      }
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith({
        title: 'Error al eliminar la sucursal',
        iconName: 'error',
        position: 'top-right',
        text: 'No se ha encontrado la sucursal'
      });

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(mockErrorResponse);
      expect(error).toStrictEqual(mockErrorResponse);
    });
  });
});

import { renderHook, waitFor, act } from '@testing-library/react';
import useRemoveZone from './useRemoveZone';
import { removeZone } from '@/api/Zones';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from '@adelco/web-components';

jest.mock('@/api/Zones', () => ({
  removeZone: jest.fn()
}));

jest.mock('@adelco/web-components', () => ({
  ...jest.requireActual('@adelco/web-components'),
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('useRemoveZone', () => {
  let queryClient: QueryClient;
  const removeZoneId = 1;

  beforeEach(() => {
    (removeZone as jest.Mock).mockResolvedValue(removeZoneId);
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
      () => useRemoveZone({ onSuccess: mockOnSuccess }),
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
      result.current.removeZone(removeZoneId);
    });

    await waitFor(() => {
      expect(removeZone).toHaveBeenCalledWith(removeZoneId);

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(removeZoneId);
    });

    expect(spyInvalidateQueries).toHaveBeenCalledTimes(1);
    expect(spyInvalidateQueries).toHaveBeenCalledWith(['zones']);
  });

  it('should show an error toast when there is an error', async () => {
    const mockOnError = jest.fn();
    const mockErrorResponse = { statusCode: 404 };
    let error: Error | null = null;

    (removeZone as jest.Mock).mockImplementation(() =>
      Promise.reject(mockErrorResponse)
    );

    const { result } = renderHook(
      () => useRemoveZone({ onError: mockOnError }),
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
        await result.current.removeZone(removeZoneId);
      } catch (e) {
        error = e as Error;
      }
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith({
        title: 'Error al eliminar la zona',
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

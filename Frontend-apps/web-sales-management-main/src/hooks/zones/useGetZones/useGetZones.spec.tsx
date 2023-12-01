import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getZones } from '@/api/Zones';
import useGetZones from './useGetZones';
import { toast } from '@adelco/web-components';

jest.mock('@/api/Zones', () => ({
  getZones: jest.fn()
}));

jest.mock('@adelco/web-components', () => ({
  ...jest.requireActual('@adelco/web-components'),
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('useGetZones', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });
    jest.clearAllMocks();
  });

  it('should fetch zones and handle pagination', async () => {
    // Arrange
    const mockZonesPage1 = [
      { id: 1, name: 'Zones 1' },
      { id: 2, name: 'Zones 2' },
      { id: 3, name: 'Zones 3' }
    ];

    const mockZonesPage2 = [
      { id: 4, name: 'Zones 4' },
      { id: 5, name: 'Zones 5' }
    ];

    const mockResultPage1 = {
      results: mockZonesPage1,
      total: 3
    };

    const mockResultPage2 = {
      results: mockZonesPage2,
      total: 2
    };

    (getZones as jest.Mock)
      .mockResolvedValueOnce(mockResultPage1)
      .mockResolvedValueOnce(mockResultPage2);

    const mockOnSuccess = jest.fn();

    const { result } = renderHook(
      () => useGetZones({ onSuccess: mockOnSuccess }),
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

    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.error).toBeNull();
      expect(result.current.zones).toEqual(mockResultPage1);
      expect(result.current.page).toEqual(1);
      expect(result.current.totalPages).toEqual(1);

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResultPage1);
    });

    // Act - Changing the page
    act(() => result.current.setPage(2));

    expect(result.current.page).toEqual(2);
  });

  it('should show an error toast when there is an error', async () => {
    const mockErrorResponse = { statusCode: 404 };

    (getZones as jest.Mock).mockImplementation(() =>
      Promise.reject(mockErrorResponse)
    );

    const mockOnError = jest.fn();

    const { result } = renderHook(() => useGetZones({ onError: mockOnError }), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      }
    });

    // Assert
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith({
        title: 'Error al obtener las zonas',
        iconName: 'error',
        position: 'top-right',
        text: 'No se han encontrado zonas'
      });

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(mockErrorResponse);
      expect(result.current.error).toBe(mockErrorResponse);
    });
  });
});

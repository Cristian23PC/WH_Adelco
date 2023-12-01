import { renderHook, waitFor, act } from '@testing-library/react';
import useEditZone from './useEditZone';
import { editZone } from '@/api/Zones';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from '@adelco/web-components';

jest.mock('@/api/Zones', () => ({
  editZone: jest.fn()
}));

jest.mock('@adelco/web-components', () => ({
  ...jest.requireActual('@adelco/web-components'),
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('useEditZone', () => {
  let queryClient: QueryClient;
  const editZoneData = {
    name: 'zone name',
    zoneManagerId: 'manager@mail.com'
  };

  beforeEach(() => {
    (editZone as jest.Mock).mockResolvedValue(editZoneData);
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });
    jest.clearAllMocks();
  });

  it('should edit a zone and invalidate queries on success', async () => {
    const spyInvalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
    const mockOnSuccess = jest.fn();

    // Act
    const { result } = renderHook(
      () => useEditZone({ onSuccess: mockOnSuccess }),
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
      result.current.editZone({ payload: editZoneData, id: 1 });
    });

    await waitFor(() => {
      expect(editZone).toHaveBeenCalledWith({ payload: editZoneData, id: 1 });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(editZoneData);
    });
    expect(spyInvalidateQueries).toHaveBeenCalledTimes(1);
    expect(spyInvalidateQueries).toHaveBeenCalledWith(['zones']);
  });

  it('should show an error toast when there is an error', async () => {
    const mockOnError = jest.fn();
    const mockErrorResponse = { statusCode: 404 };
    let error: Error | null = null;

    (editZone as jest.Mock).mockImplementation(() =>
      Promise.reject(mockErrorResponse)
    );

    const { result } = renderHook(() => useEditZone({ onError: mockOnError }), {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      }
    });

    act(async () => {
      try {
        await result.current.editZone({ payload: editZoneData, id: 1 });
      } catch (e) {
        error = e as Error;
      }
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith({
        title: `Error al modificar la zona`,
        iconName: 'error',
        position: 'top-right',
        text: 'No tienes acceso al gerente'
      });

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(mockErrorResponse);
      expect(error).toStrictEqual(mockErrorResponse);
    });
  });
});

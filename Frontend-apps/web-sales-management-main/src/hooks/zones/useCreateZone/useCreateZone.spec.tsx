import { renderHook, waitFor, act } from '@testing-library/react';
import useCreateZone from './useCreateZone';
import { createZone } from '@/api/Zones';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from '@adelco/web-components';

jest.mock('@/api/Zones', () => ({
  createZone: jest.fn()
}));

jest.mock('@adelco/web-components', () => ({
  ...jest.requireActual('@adelco/web-components'),
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('useCreateZone', () => {
  let queryClient: QueryClient;
  const createZoneData = {
    name: 'zone name',
    zoneManagerId: 'manager@mail.com'
  };

  beforeEach(() => {
    (createZone as jest.Mock).mockResolvedValue(createZoneData);
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
      () => useCreateZone({ onSuccess: mockOnSuccess }),
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
      result.current.createZone(createZoneData);
    });

    await waitFor(() => {
      expect(createZone).toHaveBeenCalledWith(createZoneData);

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(createZoneData);
    });

    expect(spyInvalidateQueries).toHaveBeenCalledTimes(1);
    expect(spyInvalidateQueries).toHaveBeenCalledWith(['zones']);
  });

  it('should show an error toast when there is an error', async () => {
    const mockOnError = jest.fn();
    const mockErrorResponse = { statusCode: 404 };
    let error: Error | null = null;

    (createZone as jest.Mock).mockImplementation(() =>
      Promise.reject(mockErrorResponse)
    );

    const { result } = renderHook(
      () => useCreateZone({ onError: mockOnError }),
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
        await result.current.createZone(createZoneData);
      } catch (e) {
        error = e as Error;
      }
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith({
        title: `Error al crear la zona`,
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

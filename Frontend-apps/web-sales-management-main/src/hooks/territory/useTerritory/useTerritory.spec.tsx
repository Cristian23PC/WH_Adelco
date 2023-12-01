import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTerritories } from '@/api/Territory';
import useTerritory from './useTerritory';

jest.mock('@/api/Territory', () => ({
  getTerritories: jest.fn()
}));

describe('useTerritory', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  it('should fetch territories and handle pagination', async () => {
    // Arrange
    const mockTerritoriesPage1 = [
      { id: 1, name: 'Territory 1' },
      { id: 2, name: 'Territory 2' },
      { id: 3, name: 'Territory 3' }
    ];

    const mockTerritoriesPage2 = [
      { id: 4, name: 'Territory 4' },
      { id: 5, name: 'Territory 5' }
    ];

    const mockResultPage1 = {
      results: mockTerritoriesPage1,
      total: 3
    };

    const mockResultPage2 = {
      results: mockTerritoriesPage2,
      total: 2
    };

    (getTerritories as jest.Mock)
      .mockResolvedValueOnce(mockResultPage1)
      .mockResolvedValueOnce(mockResultPage2);

    // Act
    const { result } = renderHook(() => useTerritory(), {
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
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.error).toBeNull();
      expect(result.current.territories).toEqual(mockResultPage1);
      expect(result.current.page).toEqual(1);
      expect(result.current.totalPages).toEqual(1);
    });

    // Act - Changing the page
    act(() => result.current.setPage(2));

    expect(result.current.page).toEqual(2);
  });
});

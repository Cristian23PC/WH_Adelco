import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getUsersList } from '@/api/Users/Users';
import { toQueryParams } from '@/utils/Request';
import useUsersList from './useUsersList';

jest.mock('@/api/Users/Users', () => ({
  getUsersList: jest.fn()
}));

jest.mock('@/utils/Request', () => ({
  toQueryParams: jest.fn()
}));

describe('useUsersList', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  it('should fetch users and handle pagination', async () => {
    // Arrange
    const mockUsersPage1 = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' }
    ];

    const mockUsersPage2 = [
      { id: 4, name: 'User 4' },
      { id: 5, name: 'User 5' }
    ];

    const mockResultPage1 = {
      results: mockUsersPage1,
      total: 5
    };

    const mockResultPage2 = {
      results: mockUsersPage2,
      total: 5
    };

    (getUsersList as jest.Mock)
      .mockResolvedValueOnce(mockResultPage1)
      .mockResolvedValueOnce(mockResultPage2);
    (toQueryParams as jest.Mock).mockReturnValue('offset=0&limit=10');

    // Act
    const { result } = renderHook(() => useUsersList(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )
    });

    // Assert
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.error).toBeNull();
      expect(result.current.users).toEqual(mockResultPage1);
      expect(result.current.page).toEqual(1);
      expect(result.current.totalPages).toEqual(1);
    });

    // Act - Changing the page
    act(() => result.current.setPage(2));

    expect(result.current.page).toEqual(2);
  });
});

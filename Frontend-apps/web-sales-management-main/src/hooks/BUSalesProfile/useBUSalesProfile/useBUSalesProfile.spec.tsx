import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getBUSalesProfiles } from '@/api/BUSalesProfile';
import { mapBUSalesProfile } from '@/utils/mappers/buSalesProfile/buSalesProfile';
import useBUSalesProfile from './useBUSalesProfile';
import { BUSalesProfile } from '../../../types/BUSalesProfile';

jest.mock('@/api/BUSalesProfile', () => ({
  getBUSalesProfiles: jest.fn()
}));

jest.mock('@/utils/mappers/buSalesProfile/buSalesProfile', () => ({
  mapBUSalesProfile: jest.fn()
}));

describe('useBUSalesProfile', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  it('should fetch BU sales profiles and handle pagination', async () => {
    // Arrange
    const mockProfilesPage1 = [
      { id: 1, name: 'Profile 1' },
      { id: 2, name: 'Profile 2' },
      { id: 3, name: 'Profile 3' }
    ];

    const mockProfilesPage2 = [
      { id: 4, name: 'Profile 4' },
      { id: 5, name: 'Profile 5' }
    ];

    const mockResultPage1 = {
      results: mockProfilesPage1,
      total: 3
    };

    const mockResultPage2 = {
      results: mockProfilesPage2,
      total: 2
    };

    (getBUSalesProfiles as jest.Mock)
      .mockResolvedValueOnce(mockResultPage1)
      .mockResolvedValueOnce(mockResultPage2);
    (mapBUSalesProfile as jest.Mock).mockImplementation(
      (profile: BUSalesProfile) => profile
    );

    // Act
    const { result } = renderHook(() => useBUSalesProfile(), {
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
      expect(result.current.buSalesProfiles).toEqual(mockResultPage1);
      expect(result.current.page).toEqual(1);
      expect(result.current.totalPages).toEqual(1);
    });

    // Act - Changing the page
    act(() => result.current.setPage(2));

    expect(result.current.page).toEqual(2);
  });
});

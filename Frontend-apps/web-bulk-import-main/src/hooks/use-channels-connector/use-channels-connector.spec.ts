import { renderHook } from '@testing-library/react-hooks';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { useChannelsFetcher } from './use-channels-connector';

jest.mock('@commercetools-frontend/application-shell');

describe('useChannelsFetcher', () => {
  beforeEach(() => {
    (useMcQuery as jest.Mock).mockReturnValue({
      data: {
        channels: [
          /* mocked channels data */
        ],
      },
      error: undefined,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch channels data', () => {
    const { result } = renderHook(() => useChannelsFetcher());

    expect(useMcQuery).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          limit: 50,
          offset: 0,
        },
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
      })
    );

    expect(result.current.channelsPaginatedResult).toEqual([]);
    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });
});

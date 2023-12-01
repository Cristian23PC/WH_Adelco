import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import type {
  TFetchChannelsQuery,
  TFetchChannelsQueryVariables,
} from '../../types/generated/ctp';
import FetchChannelsQuery from './fetch-channels-query';

type TUseChannelsFetcher = () => {
  channelsPaginatedResult?: TFetchChannelsQuery['channels'];
  error?: ApolloError;
  loading: boolean;
};

export const useChannelsFetcher: TUseChannelsFetcher = () => {
  const { data, error, loading } = useMcQuery<
    TFetchChannelsQuery,
    TFetchChannelsQueryVariables
  >(FetchChannelsQuery, {
    variables: {
      limit: 50,
      offset: 0,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    channelsPaginatedResult: data?.channels,
    error,
    loading,
  };
};

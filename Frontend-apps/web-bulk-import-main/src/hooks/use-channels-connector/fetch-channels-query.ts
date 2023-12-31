import { gql } from '@apollo/client';

const FetchChannelsQuery = gql`
  query FetchChannels($limit: Int!, $offset: Int!, $sort: [String!]) {
    channels(limit: $limit, offset: $offset, sort: $sort) {
      total
      count
      offset
      results {
        id
        key
        roles
        nameAllLocales {
          locale
          value
        }
      }
    }
  }
`;

export default FetchChannelsQuery;

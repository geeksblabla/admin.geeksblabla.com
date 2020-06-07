import gql from "graphql-tag";

export const GET_EPISODES = gql`
  query allEpisodes($size: Int, $cursor: String) {
    allEpisodes(_size: $size, _cursor: $cursor) {
      after
      data {
        _id
        _ts
        description
        guest
        verified
        scheduled
        done
        email
        name
        votes {
          data {
            _id
            email
          }
        }
      }
    }
  }
`;

import gql from "graphql-tag";

export const GET_EPISODES = gql`
  {
    allEpisodes {
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

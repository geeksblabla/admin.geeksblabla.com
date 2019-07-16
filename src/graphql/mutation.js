import gql from "graphql-tag";

export const UPDATE_EPISODE = gql`
  mutation updateEpisode($id: ID!, $data: EpisodeInput!) {
    updateEpisode(id: $id, data: $data) {
      _id
    }
  }
`;

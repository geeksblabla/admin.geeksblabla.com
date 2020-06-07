import React, { useState, useRef } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { ApolloProvider, Query } from "react-apollo";
import Popup from "reactjs-popup";

import { client, GET_EPISODES } from "./graphql";
import UpdateEpisode from "./UpdateEpisode";

export default function Dashboard() {
  const user = netlifyIdentity.currentUser();
  const [selectedEpisode, setSelectedEpisode] = useState({});
  const [open, setOpen] = useState(false);

  const closePopup = () => {
    setOpen(false);
  };
  const openUpdateModal = (episode) => {
    setSelectedEpisode(episode);
    setOpen(true);
  };

  return (
    <ApolloProvider client={client}>
      <div className="container">
        <div className="header">
          <span>
            You are logged in as <b>{user.email}</b>{" "}
          </span>
          <button onClick={() => netlifyIdentity.logout()}>Logout</button>
        </div>
        <br />
        <br />
        <Popup
          open={open}
          onClose={() => setOpen(false)}
          contentStyle={{
            minWidth: "400px",
            borderRadius: "15px",
            padding: "20px",
            maxHeight: "80vh",
            overflow: "scroll",
          }}
        >
          <UpdateEpisode
            closePopup={closePopup}
            episode={selectedEpisode}
            key={selectedEpisode._id}
          />
        </Popup>

        <Query query={GET_EPISODES} variables={{ size: 20 }}>
          {({ loading, error, data, fetchMore }) => {
            if (loading) return <div> loading ..... </div>;
            if (error) return `Error! ${error.message}`;

            return (
              <div>
                <table className="episodes">
                  <thead>
                    <tr>
                      <th> Episode Proposal </th>
                      <th> Guests </th>
                      <th> By </th>
                      <th> verified </th>
                      <th> Done </th>
                      <th> Updated </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.allEpisodes.data
                      .sort((a, b) => b._ts - a._ts)
                      .map((e) => (
                        <Episode
                          key={e._id}
                          episode={e}
                          onClick={() => openUpdateModal(e)}
                        />
                      ))}
                  </tbody>
                </table>

                <button
                  onClick={() =>
                    fetchMore({
                      query: GET_EPISODES,
                      variables: { cursor: data.allEpisodes.after, size: 20 },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const data = fetchMoreResult.allEpisodes.data;
                        const after = fetchMoreResult.allEpisodes.after;
                        return data.length
                          ? {
                              allEpisodes: {
                                __typename:
                                  previousResult.allEpisodes.__typename,
                                after,
                                data: [
                                  ...previousResult.allEpisodes.data,
                                  ...data,
                                ],
                              },
                            }
                          : previousResult;
                      },
                    })
                  }
                >
                  load More
                </button>
              </div>
            );
          }}
        </Query>
      </div>
    </ApolloProvider>
  );
}

const Episode = ({
  onClick,
  episode: { _id, _ts, description, guest, verified, done, name },
}) => {
  return (
    <tr key={_id} onClick={onClick}>
      <td> {description}</td>
      <td> {guest}</td>
      <td> {name}</td>
      <td>
        <input type="checkbox" checked={!!verified} readOnly />
      </td>
      <td>
        <input type="checkbox" checked={!!done} readOnly />
      </td>
      <td>{dateFromTs(_ts)}</td>
    </tr>
  );
};

const dateFromTs = (ts) => {
  const currentDate = new Date(ts / 1000);
  const date = currentDate.getDate();
  const month = currentDate.getMonth(); //Be careful! January is 0 not 1
  const year = currentDate.getFullYear();

  const dateString = date + "-" + (month + 1) + "-" + year;
  return dateString;
};

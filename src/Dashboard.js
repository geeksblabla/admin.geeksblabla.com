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
  const openUpdateModal = episode => {
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
            padding: "20px"
          }}
        >
          <UpdateEpisode
            closePopup={closePopup}
            episode={selectedEpisode}
            key={selectedEpisode._id}
          />
        </Popup>
        <div>
          <table className="episodes">
            <thead>
              <tr>
                <th> Episode Proposal </th>
                <th> Guests </th>
                <th> By </th>
                <th> verified </th>
                <th> Date </th>
              </tr>
            </thead>

            <Query query={GET_EPISODES}>
              {({ loading, error, data }) => {
                if (loading) return <tbody> loading ..... </tbody>;
                if (error) return `Error! ${error.message}`;

                return (
                  <tbody>
                    {data.allEpisodes.data
                      .sort((a, b) => b._ts - a._ts)
                      .map(e => (
                        <Episode
                          key={e._id}
                          episode={e}
                          onClick={() => openUpdateModal(e)}
                        />
                      ))}
                  </tbody>
                );
              }}
            </Query>
          </table>
        </div>
      </div>
    </ApolloProvider>
  );
}

const Episode = ({
  onClick,
  episode: {
    _id,
    _ts,
    description,
    guest,
    verified,
    scheduled,
    done,
    email,
    name
  }
}) => {
  return (
    <tr key={_id} onClick={onClick}>
      <td> {description}</td>
      <td> {guest}</td>
      <td> {name}</td>
      <td>
        <input type="checkbox" checked={!!verified} readOnly />
      </td>
      <td>{dateFromTs(_ts)}</td>
    </tr>
  );
};

const dateFromTs = ts => {
  const currentDate = new Date(ts / 1000);
  const date = currentDate.getDate();
  const month = currentDate.getMonth(); //Be careful! January is 0 not 1
  const year = currentDate.getFullYear();

  const dateString = date + "-" + (month + 1) + "-" + year;
  return dateString;
};

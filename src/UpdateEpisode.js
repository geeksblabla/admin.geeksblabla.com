import React, { useReducer } from "react";
import { Mutation } from "react-apollo";
import { UPDATE_EPISODE, GET_EPISODES } from "./graphql";

const reducer = (state, action) => {
  const s = state;
  s[action.name] = action.value;
  return { ...s };
};

const UpdateEpisode = ({ closePopup, episode: initialEpisode }) => {
  const [episode, dispatch] = useReducer(reducer, initialEpisode);

  return (
    <Mutation mutation={UPDATE_EPISODE}>
      {(updateEpisode, { data, loading }) => (
        <form
          className="form"
          onSubmit={e => {
            e.preventDefault();
            const {
              _id,
              description,
              guest,
              verified,
              scheduled,
              done,
              email,
              name
            } = episode;
            {
              const variables = {
                id: _id,
                data: {
                  description,
                  guest,
                  verified,
                  scheduled,
                  done,
                  email,
                  name
                }
              };

              updateEpisode({
                variables,
                refetchQueries: [{ query: GET_EPISODES }]
              });
            }
          }}
        >
          <h1> Episode Proposal </h1>
          <div className="input">
            <label> EPISODE : </label>
            <textarea
              required
              onChange={e =>
                dispatch({ name: "description", value: e.target.value })
              }
              placeholder=" Please explain you suggestion as mach as possible "
              rows="4"
              value={episode.description}
            />
          </div>

          <div className="input">
            <label> GUEST(s) : </label>
            <textarea
              required
              onChange={e => dispatch({ name: "guest", value: e.target.value })}
              placeholder="Guest Name, profile links ..."
              rows="3"
              value={episode.guest}
            />
          </div>
          <div className="input">
            <label> VERIFIED :</label>
            <input
              type="checkbox"
              checked={episode.verified}
              onChange={e =>
                dispatch({ name: "verified", value: e.target.checked })
              }
            />
          </div>
          <div className="input">
            <label> SCHEDULED :</label>
            <input
              type="checkbox"
              checked={episode.scheduled}
              onChange={e =>
                dispatch({ name: "scheduled", value: e.target.checked })
              }
            />
          </div>
          <div className="input">
            <label> DONE : </label>
            <input
              type="checkbox"
              checked={episode.done}
              onChange={e =>
                dispatch({ name: "done", value: e.target.checked })
              }
            />
          </div>

          <h4> By : </h4>
          <div className="input">
            <label> NAME : </label>
            <input
              type="text"
              value={episode.name}
              onChange={e => dispatch({ name: "name", value: e.target.value })}
            />
          </div>
          <div className="input">
            <label> EMAIL : </label>
            <input
              type="text"
              value={episode.email}
              onChange={e => dispatch({ name: "email", value: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit" className="button" disabled={loading}>
              {loading && "updating ..."}
              {!loading && !data && "Update Proposal"}
              {data && "Proposal Updated "}
            </button>
            <button
              className="button"
              disabled={loading}
              onClick={() => closePopup()}
            >
              Done
            </button>
          </div>

          <br />
        </form>
      )}
    </Mutation>
  );
};

export default UpdateEpisode;

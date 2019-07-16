import React, { useState, useEffect } from "react";
import "./App.css";
import netlifyIdentity from "netlify-identity-widget";
import Dashboard from "./Dashboard";

netlifyIdentity.init({
  container: "#netlify", // container to attach to
  APIUrl: "https://admin.geeksblabla.com/.netlify/identity" // Absolute url to endpoint.  ONLY USE IN SPECIAL CASES!
});

function App() {
  const u = netlifyIdentity.currentUser();

  const [isAuthenticated, setIsAuthenticated] = useState(u !== null);
  const [user, setUser] = React.useState(u);

  useEffect(() => {
    netlifyIdentity.on("login", user => {
      setIsAuthenticated(true);
      setUser(user);
      netlifyIdentity.close();
    });
    netlifyIdentity.on("logout", () => {
      setIsAuthenticated(false);
      setUser({});
    });
  }, []);

  return (
    <React.Fragment>
      {isAuthenticated ? (
        <Dashboard user={user} />
      ) : (
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button onClick={() => netlifyIdentity.open()}>Login</button>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;

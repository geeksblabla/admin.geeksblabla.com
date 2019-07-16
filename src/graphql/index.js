import { ApolloClient, InMemoryCache } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import netlifyIdentity from "netlify-identity-widget";

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const user = netlifyIdentity.currentUser();

  // return the headers to the context so httpLink can read them

  return {
    headers: {
      ...headers,
      authorization: "Bearer " + user.token.access_token
    }
  };
});

const uri = ".netlify/functions/funadb/";
export const client = new ApolloClient({
  link: authLink.concat(createHttpLink({ uri })),
  cache: new InMemoryCache()
});

export { UPDATE_EPISODE } from "./mutation";
export { GET_EPISODES } from "./queries";

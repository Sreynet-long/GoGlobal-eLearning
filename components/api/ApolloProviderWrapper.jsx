import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "dotenv/config.js";

const client = new ApolloClient({
  uri: "http://192.168.5.36:6800/graphql",
  cache: new InMemoryCache(),
});
export default function ApolloProviderWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const uri = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "/graphql";

if (!uri) throw new Error("missing API URL, check your .env !");

console.log("GQL API URL :", uri);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: uri,
    credentials: "include", 
  }),
});

export default client;

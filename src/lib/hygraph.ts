import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT!;

// Public read-only client (used in RSC / getStaticProps)
export const hygraphClient = new GraphQLClient(endpoint);

// Mutation client – uses server-only auth token
export const hygraphMutationClient = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
  },
});

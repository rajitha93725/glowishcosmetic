import { GraphQLClient } from "graphql-request";

const cdnEndpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT!;

// CDN (read-only): https://ap-south-1.cdn.hygraph.com/content/PROJECT_ID/master
// API (read+write): https://api-ap-south-1.hygraph.com/v2/PROJECT_ID/master
function toApiEndpoint(cdnUrl: string): string {
  const match = cdnUrl.match(/https:\/\/([\w-]+)\.cdn\.hygraph\.com\/content\/([^/]+)\/master/);
  if (!match) return cdnUrl;
  const [, region, projectId] = match;
  return `https://api-${region}.hygraph.com/v2/${projectId}/master`;
}

// Public read-only client (used in RSC / getStaticProps)
export const hygraphClient = new GraphQLClient(cdnEndpoint);

// Mutation client – uses the writable API endpoint (not CDN) + auth token
export const hygraphMutationClient = new GraphQLClient(toApiEndpoint(cdnEndpoint), {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
  },
});

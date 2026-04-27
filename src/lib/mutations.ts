import { gql } from "graphql-request";

export const buildCreateOrderMutation = (productIds: string[]) => {
  const connect = productIds.map((id) => `{ id: "${id}" }`).join(", ");
  return gql`
    mutation CreateOrder(
      $customerName: String!
      $phone: String!
      $address: String!
      $notes: String
    ) {
      createOrder(
        data: {
          customerName: $customerName
          phone: $phone
          address: $address
          notes: $notes
          orderedProducts: { connect: [${connect}] }
        }
      ) {
        id
        customerName
        phone
        createdAt
      }
    }
  `;
};

export const PUBLISH_ORDER = gql`
  mutation PublishOrder($id: ID!) {
    publishOrder(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;

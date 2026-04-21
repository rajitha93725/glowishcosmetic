import { gql } from "graphql-request";

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $customerName: String!
    $phone: String!
    $address: String!
    $productIds: [ID!]!
    $notes: String
  ) {
    createOrder(
      data: {
        customerName: $customerName
        phone: $phone
        address: $address
        notes: $notes
        orderedProducts: { connect: [{ where: { id_in: $productIds } }] }
      }
    ) {
      id
      customerName
      phone
      createdAt
    }
  }
`;

export const PUBLISH_ORDER = gql`
  mutation PublishOrder($id: ID!) {
    publishOrder(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;

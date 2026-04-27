import { gql } from "graphql-request";

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $customerName: String!
    $phone: String!
    $address: String!
    $notes: String
    $productIds: [ProductWhereUniqueInput!]!
    $customerEmail: String
    $discountApplied: Float
  ) {
    createOrder(
      data: {
        customerName: $customerName
        phone: $phone
        address: $address
        notes: $notes
        orderedProducts: { connect: $productIds }
        customerEmail: $customerEmail
        discountApplied: $discountApplied
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
    publishOrder(where: { id: $id }, to: [PUBLISHED]) {
      id
    }
  }
`;

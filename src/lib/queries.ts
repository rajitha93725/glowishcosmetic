import { gql } from "graphql-request";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(orderBy: createdAt_DESC) {
      id
      name
      code
      description { html }
      tags
      price
      category
      brand { id name slug }
      featured
      image { url width height }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(where: { id: $id }) {
      id
      name
      code
      description { html }
      tags
      price
      category
      brand { id name slug }
      image { url width height }
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    products(where: { featured: true }, first: 6) {
      id
      name
      code
      tags
      price
      category
      brand { id name slug }
      image { url width height }
    }
  }
`;

export const GET_WEBSITE_SETTINGS = gql`
  query GetWebsiteSettings {
    websiteSetting(where: { id: "singleton" }) {
      title
      aboutContent { html }
      contactEmail
      contactPhone
      contactAddress
      headerImage { url }
    }
  }
`;

export const GET_PRODUCTS_BY_TAG = gql`
  query GetProductsByTag($tag: String!) {
    products(where: { tags_contains_some: [$tag] }) {
      id
      name
      code
      tags
      price
      category
      brand { id name slug }
      image { url width height }
    }
  }
`;

export const GET_ALL_BRANDS = gql`
  query GetAllBrands {
    brands(orderBy: name_ASC) {
      id
      name
      slug
    }
  }
`;

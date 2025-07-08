"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.typeDefs = (0, graphql_tag_1.gql) `
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
    reviews: [Review!]!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String
    description: String
    createdAt: String!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String
    createdAt: String!
    user: User!
    book: Book!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    books: [Book!]!
    book(id: ID!): Book
    reviews: [Review!]!
    review(id: ID!): Review
  }

  type Mutation {
    register(email: String!, username: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createBook(
      title: String!
      author: String!
      isbn: String
      description: String
    ): Book!
    createReview(bookId: ID!, rating: Int!, comment: String): Review!
    updateReview(id: ID!, rating: Int, comment: String): Review!
    deleteReview(id: ID!): Boolean!
  }
`;

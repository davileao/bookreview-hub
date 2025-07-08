import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    reviews: [Review!]!
    reviewCount: Int!
    averageRating: Float!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    reviews: [Review!]!
    averageRating: Float!
    reviewCount: Int!
  }

  type Review {
    id: ID!
    rating: Int!
    text: String!
    user: User!
    book: Book!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type UserStats {
    id: ID!
    name: String!
    email: String!
    reviewCount: Int!
    averageRating: Float!
    favoriteGenre: String
  }

  type TopUser {
    id: ID!
    name: String!
    email: String!
    reviewCount: Int!
    averageRating: Float!
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    userByEmail(email: String!): User
    searchUsers(query: String!): [User!]!
    userStats(id: ID!): UserStats
    myStats: UserStats
    topUsers(limit: Int): [TopUser!]!
    myReviews: [Review!]!
    books: [Book!]!
    book(id: ID!): Book
    searchBooks(query: String!): [Book!]!
    booksWithRating: [Book!]!
    reviews: [Review!]!
    review(id: ID!): Review
  }

  type Mutation {
    register(email: String!, name: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(
      name: String
      email: String
      currentPassword: String
      newPassword: String
    ): User!
    deleteAccount(password: String!): Boolean!
    createBook(title: String!, author: String!): Book!
    updateBook(id: ID!, title: String, author: String): Book!
    deleteBook(id: ID!): Boolean!
    createReview(bookId: ID!, rating: Int!, text: String!): Review!
    updateReview(id: ID!, rating: Int, text: String): Review!
    deleteReview(id: ID!): Boolean!
  }
`;

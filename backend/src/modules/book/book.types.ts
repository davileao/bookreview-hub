export const bookTypeDefs = `
  type Book {
    id: ID!
    title: String!
    author: String!
    reviews: [Review!]!
    averageRating: Float!
    reviewCount: Int!
  }

  type BookWithRating {
    id: ID!
    title: String!
    author: String!
    reviews: [Review!]!
    averageRating: Float!
    reviewCount: Int!
  }

  extend type Query {
    books: [Book!]!
    book(id: ID!): Book
    searchBooks(query: String!): [Book!]!
    booksWithRating: [BookWithRating!]!
  }

  extend type Mutation {
    createBook(title: String!, author: String!): Book!
    updateBook(id: ID!, title: String, author: String): Book!
    deleteBook(id: ID!): Boolean!
  }
`;

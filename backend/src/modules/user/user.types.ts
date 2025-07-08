export const userTypeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!
    reviews: [Review!]!
    reviewCount: Int!
    averageRating: Float!
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

  extend type Query {
    users: [User!]!
    user(id: ID!): User
    userByEmail(email: String!): User
    searchUsers(query: String!): [User!]!
    userStats(id: ID!): UserStats
    myStats: UserStats
    topUsers(limit: Int): [TopUser!]!
    myReviews: [Review!]!
  }

  extend type Mutation {
    updateProfile(
      name: String
      email: String
      currentPassword: String
      newPassword: String
    ): User!
    deleteAccount(password: String!): Boolean!
  }
`;

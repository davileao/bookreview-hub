import { UserService } from "./user.service";
import { Context } from "../../context";

const userService = new UserService();

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: Context) => {
      return userService.getAllUsers();
    },

    user: async (_: any, { id }: { id: string }, context: Context) => {
      const userId = parseInt(id);
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },

    userByEmail: async (
      _: any,
      { email }: { email: string },
      context: Context
    ) => {
      if (!email || email.trim().length === 0) {
        throw new Error("Email is required");
      }

      const user = await userService.getUserByEmail(email.trim());
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },

    searchUsers: async (
      _: any,
      { query }: { query: string },
      context: Context
    ) => {
      if (!query || query.trim().length === 0) {
        throw new Error("Search query is required");
      }

      return userService.searchUsers(query.trim());
    },

    userStats: async (_: any, { id }: { id: string }, context: Context) => {
      const userId = parseInt(id);
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      const stats = await userService.getUserStats(userId);
      if (!stats) {
        throw new Error("User not found");
      }

      return stats;
    },

    myStats: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const stats = await userService.getUserStats(context.user.id);
      if (!stats) {
        throw new Error("User not found");
      }

      return stats;
    },

    topUsers: async (
      _: any,
      { limit }: { limit?: number },
      context: Context
    ) => {
      return userService.getUsersWithMostReviews(limit || 10);
    },

    myReviews: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return userService.getUserReviews(context.user.id);
    },
  },

  Mutation: {
    updateProfile: async (
      _: any,
      {
        name,
        email,
        currentPassword,
        newPassword,
      }: {
        name?: string;
        email?: string;
        currentPassword?: string;
        newPassword?: string;
      },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      // Basic validation
      if (!name && !email && !newPassword) {
        throw new Error("At least one field must be provided for update");
      }

      if (email && email.trim().length === 0) {
        throw new Error("Email cannot be empty");
      }

      if (name && name.trim().length === 0) {
        throw new Error("Name cannot be empty");
      }

      if (newPassword && newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
      }

      // Email validation
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Please provide a valid email address");
        }
      }

      const updateData: any = {};
      if (name && name.trim().length > 0) updateData.name = name.trim();
      if (email && email.trim().length > 0) updateData.email = email.trim();
      if (newPassword) {
        updateData.newPassword = newPassword;
        updateData.currentPassword = currentPassword;
      }

      return userService.updateUser(context.user.id, updateData);
    },

    deleteAccount: async (
      _: any,
      { password }: { password: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      if (!password) {
        throw new Error("Password is required to delete account");
      }

      // Verify password before deletion
      const user = await context.prisma.user.findUnique({
        where: { id: context.user.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const bcrypt = require("bcrypt");
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      return userService.deleteUser(context.user.id);
    },
  },

  User: {
    reviews: async (parent: any, _: any, context: Context) => {
      // Reviews are already included in the parent object from the service
      return parent.reviews || [];
    },

    reviewCount: async (parent: any, _: any, context: Context) => {
      return parent.reviews ? parent.reviews.length : 0;
    },

    averageRating: async (parent: any, _: any, context: Context) => {
      if (!parent.reviews || parent.reviews.length === 0) {
        return 0;
      }

      const totalRating = parent.reviews.reduce(
        (sum: number, review: any) => sum + review.rating,
        0
      );
      return Math.round((totalRating / parent.reviews.length) * 10) / 10;
    },
  },
};

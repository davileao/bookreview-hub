import { Context } from "./context";
import { authResolvers } from "./modules/auth";
import { bookResolvers } from "./modules/book";
import { userResolvers } from "./modules/user";

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...bookResolvers.Query,
    ...userResolvers.Query,

    reviews: async (_: any, __: any, context: Context) => {
      return context.prisma.review.findMany({
        include: {
          user: true,
          book: true,
        },
      });
    },

    review: async (_: any, { id }: { id: string }, context: Context) => {
      return context.prisma.review.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true,
          book: true,
        },
      });
    },
  },

  Mutation: {
    ...authResolvers.Mutation,
    ...bookResolvers.Mutation,
    ...userResolvers.Mutation,

    createReview: async (
      _: any,
      {
        bookId,
        rating,
        text,
      }: { bookId: string; rating: number; text?: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return context.prisma.review.create({
        data: {
          rating,
          text: text || "",
          userId: context.user.id,
          bookId: parseInt(bookId),
        },
        include: {
          user: true,
          book: true,
        },
      });
    },

    updateReview: async (
      _: any,
      { id, rating, text }: { id: string; rating?: number; text?: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const review = await context.prisma.review.findUnique({
        where: { id: parseInt(id) },
      });

      if (!review || review.userId !== context.user.id) {
        throw new Error("Review not found or not authorized");
      }

      return context.prisma.review.update({
        where: { id: parseInt(id) },
        data: {
          ...(rating !== undefined && { rating }),
          ...(text !== undefined && { text }),
        },
        include: {
          user: true,
          book: true,
        },
      });
    },

    deleteReview: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const review = await context.prisma.review.findUnique({
        where: { id: parseInt(id) },
      });

      if (!review || review.userId !== context.user.id) {
        throw new Error("Review not found or not authorized");
      }

      await context.prisma.review.delete({
        where: { id: parseInt(id) },
      });

      return true;
    },
  },

  User: {
    ...userResolvers.User,
  },

  Book: {
    ...bookResolvers.Book,
  },

  Review: {
    user: async (parent: any, _: any, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },

    book: async (parent: any, _: any, context: Context) => {
      return context.prisma.book.findUnique({
        where: { id: parent.bookId },
      });
    },
  },
};

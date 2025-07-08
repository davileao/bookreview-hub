"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
exports.resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return context.user;
        },
        books: async (_, __, context) => {
            return context.prisma.book.findMany({
                include: {
                    reviews: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
        },
        book: async (_, { id }, context) => {
            return context.prisma.book.findUnique({
                where: { id },
                include: {
                    reviews: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
        },
        reviews: async (_, __, context) => {
            return context.prisma.review.findMany({
                include: {
                    user: true,
                    book: true,
                },
            });
        },
        review: async (_, { id }, context) => {
            return context.prisma.review.findUnique({
                where: { id },
                include: {
                    user: true,
                    book: true,
                },
            });
        },
    },
    Mutation: {
        register: async (_, { email, username, password, }, context) => {
            // Implementation will depend on your auth module
            throw new Error("Register mutation not implemented yet");
        },
        login: async (_, { email, password }, context) => {
            // Implementation will depend on your auth module
            throw new Error("Login mutation not implemented yet");
        },
        createBook: async (_, { title, author, isbn, description, }, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return context.prisma.book.create({
                data: {
                    title,
                    author,
                    isbn,
                    description,
                },
            });
        },
        createReview: async (_, { bookId, rating, comment, }, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return context.prisma.review.create({
                data: {
                    rating,
                    comment,
                    userId: context.user.id,
                    bookId,
                },
                include: {
                    user: true,
                    book: true,
                },
            });
        },
        updateReview: async (_, { id, rating, comment, }, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            const review = await context.prisma.review.findUnique({
                where: { id },
            });
            if (!review || review.userId !== context.user.id) {
                throw new Error("Review not found or not authorized");
            }
            return context.prisma.review.update({
                where: { id },
                data: {
                    ...(rating !== undefined && { rating }),
                    ...(comment !== undefined && { comment }),
                },
                include: {
                    user: true,
                    book: true,
                },
            });
        },
        deleteReview: async (_, { id }, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            const review = await context.prisma.review.findUnique({
                where: { id },
            });
            if (!review || review.userId !== context.user.id) {
                throw new Error("Review not found or not authorized");
            }
            await context.prisma.review.delete({
                where: { id },
            });
            return true;
        },
    },
    User: {
        reviews: async (parent, _, context) => {
            return context.prisma.review.findMany({
                where: { userId: parent.id },
                include: {
                    book: true,
                },
            });
        },
    },
    Book: {
        reviews: async (parent, _, context) => {
            return context.prisma.review.findMany({
                where: { bookId: parent.id },
                include: {
                    user: true,
                },
            });
        },
    },
    Review: {
        user: async (parent, _, context) => {
            return context.prisma.user.findUnique({
                where: { id: parent.userId },
            });
        },
        book: async (parent, _, context) => {
            return context.prisma.book.findUnique({
                where: { id: parent.bookId },
            });
        },
    },
};

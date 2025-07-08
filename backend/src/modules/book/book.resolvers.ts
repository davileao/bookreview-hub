import { BookService } from "./book.service";
import { Context } from "../../context";

const bookService = new BookService();

export const bookResolvers = {
  Query: {
    books: async (_: any, __: any, context: Context) => {
      return bookService.getAllBooks();
    },

    book: async (_: any, { id }: { id: string }, context: Context) => {
      const bookId = parseInt(id);
      if (isNaN(bookId)) {
        throw new Error("Invalid book ID");
      }

      const book = await bookService.getBookById(bookId);
      if (!book) {
        throw new Error("Book not found");
      }

      return book;
    },

    searchBooks: async (
      _: any,
      { query }: { query: string },
      context: Context
    ) => {
      if (!query || query.trim().length === 0) {
        throw new Error("Search query is required");
      }

      return bookService.searchBooks(query.trim());
    },

    booksWithRating: async (_: any, __: any, context: Context) => {
      return bookService.getBooksWithAverageRating();
    },
  },

  Mutation: {
    createBook: async (
      _: any,
      { title, author }: { title: string; author: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      // Basic validation
      if (!title || !author) {
        throw new Error("Title and author are required");
      }

      if (title.trim().length === 0 || author.trim().length === 0) {
        throw new Error("Title and author cannot be empty");
      }

      return bookService.createBook({
        title: title.trim(),
        author: author.trim(),
      });
    },

    updateBook: async (
      _: any,
      { id, title, author }: { id: string; title?: string; author?: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const bookId = parseInt(id);
      if (isNaN(bookId)) {
        throw new Error("Invalid book ID");
      }

      // Validate input
      if (!title && !author) {
        throw new Error(
          "At least one field (title or author) must be provided"
        );
      }

      const updateData: { title?: string; author?: string } = {};

      if (title && title.trim().length > 0) {
        updateData.title = title.trim();
      }

      if (author && author.trim().length > 0) {
        updateData.author = author.trim();
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("Title and author cannot be empty");
      }

      return bookService.updateBook(bookId, context.user.id, updateData);
    },

    deleteBook: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const bookId = parseInt(id);
      if (isNaN(bookId)) {
        throw new Error("Invalid book ID");
      }

      return bookService.deleteBook(bookId, context.user.id);
    },
  },

  Book: {
    reviews: async (parent: any, _: any, context: Context) => {
      // Reviews are already included in the parent object from the service
      return parent.reviews || [];
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

    reviewCount: async (parent: any, _: any, context: Context) => {
      return parent.reviews ? parent.reviews.length : 0;
    },
  },
};

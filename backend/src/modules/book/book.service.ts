import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateBookInput {
  title: string;
  author: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
}

export interface BookWithReviews {
  id: number;
  title: string;
  author: string;
  reviews: Array<{
    id: number;
    rating: number;
    text: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }>;
}

export class BookService {
  async getAllBooks(): Promise<BookWithReviews[]> {
    return prisma.book.findMany({
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getBookById(id: number): Promise<BookWithReviews | null> {
    return prisma.book.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async createBook({ title, author }: CreateBookInput) {
    // Check if book with same title and author already exists
    const existingBook = await prisma.book.findFirst({
      where: {
        AND: [{ title }, { author }],
      },
    });

    if (existingBook) {
      throw new Error("A book with this title and author already exists");
    }

    return prisma.book.create({
      data: {
        title,
        author,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async updateBook(id: number, userId: number, data: UpdateBookInput) {
    // Verify book exists
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new Error("Book not found");
    }

    // Check if updated title/author combination already exists (excluding current book)
    if (data.title || data.author) {
      const existingBook = await prisma.book.findFirst({
        where: {
          AND: [
            { title: data.title || book.title },
            { author: data.author || book.author },
            { NOT: { id } },
          ],
        },
      });

      if (existingBook) {
        throw new Error("A book with this title and author already exists");
      }
    }

    return prisma.book.update({
      where: { id },
      data,
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteBook(id: number, userId: number) {
    // Verify book exists
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!book) {
      throw new Error("Book not found");
    }

    // Delete all reviews first (due to foreign key constraints)
    await prisma.review.deleteMany({
      where: { bookId: id },
    });

    // Delete the book
    await prisma.book.delete({
      where: { id },
    });

    return true;
  }

  async searchBooks(query: string): Promise<BookWithReviews[]> {
    return prisma.book.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            author: {
              contains: query,
            },
          },
        ],
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getBooksWithAverageRating() {
    const books = await this.getAllBooks();

    return books.map((book) => {
      const totalRating = book.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        book.reviews.length > 0 ? totalRating / book.reviews.length : 0;

      return {
        ...book,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: book.reviews.length,
      };
    });
  }
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export interface UpdateUserInput {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UserWithReviews {
  id: number;
  name: string;
  email: string;
  reviews: Array<{
    id: number;
    rating: number;
    text: string;
    book: {
      id: number;
      title: string;
      author: string;
    };
  }>;
}

export interface UserStats {
  id: number;
  name: string;
  email: string;
  reviewCount: number;
  averageRating: number;
  favoriteGenre?: string;
}

export class UserService {
  async getAllUsers(): Promise<UserWithReviews[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        reviews: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserById(id: number): Promise<UserWithReviews | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        reviews: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserByEmail(email: string): Promise<UserWithReviews | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        reviews: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });
  }

  async updateUser(id: number, data: UpdateUserInput) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // If updating email, check if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error("Email is already taken");
      }
    }

    // If updating name, check if it's already taken
    if (data.name && data.name !== user.name) {
      const existingUser = await prisma.user.findFirst({
        where: { name: data.name },
      });

      if (existingUser) {
        throw new Error("Name is already taken");
      }
    }

    // Handle password update
    let updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new Error("Current password is required to set a new password");
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        data.currentPassword,
        user.password
      );
      if (!isValidPassword) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(data.newPassword, saltRounds);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        reviews: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteUser(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete all user's reviews first
    await prisma.review.deleteMany({
      where: { userId: id },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return true;
  }

  async getUserStats(id: number): Promise<UserStats | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const reviewCount = user.reviews.length;
    const averageRating =
      reviewCount > 0
        ? user.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        : 0;

    // Simple favorite genre logic - most reviewed author
    const authorCounts: { [key: string]: number } = {};
    user.reviews.forEach((review) => {
      const author = review.book.author;
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });

    const favoriteGenre =
      Object.keys(authorCounts).length > 0
        ? Object.keys(authorCounts).reduce((a, b) =>
            authorCounts[a] > authorCounts[b] ? a : b
          )
        : undefined;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      reviewCount,
      averageRating: Math.round(averageRating * 10) / 10,
      favoriteGenre,
    };
  }

  async searchUsers(query: string): Promise<UserWithReviews[]> {
    return prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        reviews: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserReviews(id: number) {
    return prisma.review.findMany({
      where: { userId: id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async getUsersWithMostReviews(limit: number = 10) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        reviews: {
          select: {
            id: true,
            rating: true,
          },
        },
      },
    });

    return users
      .map((user) => ({
        ...user,
        reviewCount: user.reviews.length,
        averageRating:
          user.reviews.length > 0
            ? Math.round(
                (user.reviews.reduce((sum, review) => sum + review.rating, 0) /
                  user.reviews.length) *
                  10
              ) / 10
            : 0,
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit);
  }
}

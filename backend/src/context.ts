import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { verifyToken } from "./lib/jwt";
import { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const context = async ({ req }: { req: Request }): Promise<Context> => {
  let user;

  // Get token from Authorization header
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (typeof decoded === "object" && decoded !== null) {
        const payload = decoded as JwtPayload & {
          id: number;
          email: string;
          name: string;
        };
        user = {
          id: payload.id,
          email: payload.email,
          name: payload.name,
        };
      }
    } catch (error) {
      // Token is invalid, user remains undefined
      console.warn("Invalid token:", error);
    }
  }

  return {
    prisma,
    user,
  };
};

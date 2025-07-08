import { AuthService } from "./auth.service";
import { Context } from "../../context";

const authService = new AuthService();

export const authResolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return authService.validateUser(context.user.id);
    },
  },

  Mutation: {
    register: async (
      _: any,
      {
        email,
        name,
        password,
      }: { email: string; name: string; password: string }
    ) => {
      // Basic validation
      if (!email || !name || !password) {
        throw new Error("Email, name, and password are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please provide a valid email address");
      }

      return authService.register({ email, name, password });
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      return authService.login({ email, password });
    },
  },
};

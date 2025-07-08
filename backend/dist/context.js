"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("./lib/jwt");
const prisma = new client_1.PrismaClient();
const context = async ({ req }) => {
    let user;
    // Get token from Authorization header
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
        try {
            const decoded = (0, jwt_1.verifyToken)(token);
            if (typeof decoded === "object" && decoded !== null) {
                const payload = decoded;
                user = {
                    id: payload.id,
                    email: payload.email,
                    username: payload.username,
                };
            }
        }
        catch (error) {
            // Token is invalid, user remains undefined
            console.warn("Invalid token:", error);
        }
    }
    return {
        prisma,
        user,
    };
};
exports.context = context;

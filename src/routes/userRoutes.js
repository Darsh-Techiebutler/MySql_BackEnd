import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { getUsers } from "../controllers/userGetall.js";
import { getUserById } from "../controllers/userGetById.js";
import { createUser } from "../controllers/createUser.js";
import { updateUser } from "../controllers/updateUpdate.js";
import { deleteUser } from "../controllers/deleteUser.js";
import { resetPasswordByEmail } from "../controllers/resetPassword.js"; // New controller for resetting the password

const userRoutes = express.Router();

// Get all users (admin, superadmin, user)
userRoutes.get("/", authMiddleware(["admin", "superadmin", "user"]), getUsers);

// Get user by ID (admin, superadmin)
userRoutes.get("/:id", authMiddleware(["admin", "superadmin"]), getUserById);

// Create a new user (superadmin only)
userRoutes.post("/", authMiddleware(["superadmin"]), createUser);

// Update a user (superadmin only)
userRoutes.put("/:id", authMiddleware(["superadmin"]), updateUser);

// Delete a user (superadmin only)
userRoutes.delete("/delete", authMiddleware(["superadmin"]), deleteUser);

// Reset a user's password (accessible by all users)
userRoutes.post("/reset-password", resetPasswordByEmail);

export { userRoutes };

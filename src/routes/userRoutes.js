import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { getUsers } from "../controllers/userGetall.js";
import { getUserById } from "../controllers/userGetById.js";
import { createUser } from "../controllers/createUser.js";
import { updateUser } from "../controllers/userUpdate.js";
import { deleteUser } from "../controllers/deleteUser.js";
import { resetPasswordByEmail } from "../controllers/resetPassword.js";

const userRoutes = express.Router();

userRoutes.get("/", authMiddleware(["admin", "superadmin", "user"]), getUsers);

userRoutes.get("/:id", authMiddleware(["admin", "superadmin"]), getUserById);

userRoutes.post("/", authMiddleware(["superadmin"]), createUser);

userRoutes.put("/:id", authMiddleware(["superadmin"]),updateUser );

userRoutes.delete("/delete", authMiddleware(["superadmin"]), deleteUser);




userRoutes.post("/reset-password", resetPasswordByEmail);

export { userRoutes };

// categoriesRoutes.js
import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";

const categoriesRoutes = express.Router();
categoriesRoutes.get(
  "/",
  authMiddleware(["admin", "superadmin"]),
  getCategories
);

categoriesRoutes.get(
  "/:id",
  authMiddleware(["admin", "superadmin"]),
  getCategoryById
);

categoriesRoutes.post("/Post", authMiddleware(["superadmin"]), createCategory);

categoriesRoutes.put("/:id", authMiddleware(["superadmin"]), updateCategory);

categoriesRoutes.delete("/", authMiddleware(["superadmin"]), deleteCategory);

export { categoriesRoutes };

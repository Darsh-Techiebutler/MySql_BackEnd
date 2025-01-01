import express from "express";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  verifyPost,
  getPendingPosts,
} from "../controllers/blogController.js";

const blogRoutes = express.Router();

/** Admin Routes **/

blogRoutes.get("/", authMiddleware(["admin", "superadmin"]), getPosts);

blogRoutes.get("/:id", authMiddleware(["admin", "superadmin"]), getPostById);

blogRoutes.post("/", authMiddleware(["admin"]), createPost);

blogRoutes.put("/:id", authMiddleware(["admin"]), updatePost);

blogRoutes.delete("/:id", authMiddleware(["admin"]), deletePost);

/** Super Admin Routes **/

// Get all pending posts for verification
blogRoutes.get(
  "/verification/pending",
  authMiddleware(["superadmin"]),
  getPendingPosts
);

// Verify a blog post (Approve/Reject)
blogRoutes.post(
  "/verification/:id",
  authMiddleware(["superadmin"]),
  verifyPost
);

export { blogRoutes };

import { authMiddleware } from "../Middleware/authMiddleware.js";
import express from "express";
import multer from "multer";
import {
  createPostSuperadmin,
  getPendingPosts,
  verifyPost,
  getPosts,
  deletePost,
  updatePostBybsuperadmin,
} from "../controllers/superAdminBlogController.js";
const supeadminlogRoutes = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

// Multer middleware for handling file uploads
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Define routes
supeadminlogRoutes.get("/", authMiddleware(["superadmin"]), getPosts);
supeadminlogRoutes.post(
  "/superadmin/post",
  authMiddleware(["superadmin"]),
  upload.single("image"), // Middleware to handle single file upload
  createPostSuperadmin
);

supeadminlogRoutes.get(
  "/verification/pending",
  authMiddleware(["superadmin"]),
  getPendingPosts
);
supeadminlogRoutes.post(
  "/verification/:id",
  authMiddleware(["superadmin"]),
  verifyPost
);
supeadminlogRoutes.put(
  "/superadmin/:id",
  upload.single("image"),
  authMiddleware(["superadmin"]),
  updatePostBybsuperadmin
);
supeadminlogRoutes.delete(
  "/superadmin/delete",
  authMiddleware(["superadmin"]),
  deletePost
);
export { supeadminlogRoutes };

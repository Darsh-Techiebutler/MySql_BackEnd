import express from "express";
import multer from "multer";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import {
  createPost,
  updatePost,
  getPostswithoutpending,
  getPostById,
} from "../controllers/blogController.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const blogRoutes = express.Router();

blogRoutes.get("/getall", getPostswithoutpending);
blogRoutes.get("/:id", authMiddleware(["admin", "superadmin"]), getPostById);
blogRoutes.put("/:id", authMiddleware(["admin", "superadmin"]), updatePost);
blogRoutes.post("/admin/post", upload.single("image"),authMiddleware(["admin"]), createPost);

export { blogRoutes };

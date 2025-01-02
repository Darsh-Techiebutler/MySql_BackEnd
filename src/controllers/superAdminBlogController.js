import Post from "../models/PostModel.js";
import sequelize from "../config/db.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { postValidationSchema } from "../validators/postValidators.js";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPostSuperadmin = async (req, res) => {
  try {
    console.log(req.body)
    // return false
    await postValidationSchema.validate(req.body, { abortEarly: false });
    const { title, content, category_id } = req.body;
    const author_id = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Define the upload directory and ensure it exists
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

   const originalFilePath = req.file.path;
    const finalFilePath = path.join(
      uploadDir,
      `${Date.now()}-${req.file.originalname}`
    );
    fs.renameSync(originalFilePath, finalFilePath);

    // Superadmins can directly publish the post
    const newPost = await Post.create({
      title,
      content,
      author_id,
      category_id,
      image: finalFilePath,
      status: "approved",
    });

    res.status(201).json({
      message: "Post created and published successfully",
      postId: newPost.id,
      imagePath: finalFilePath,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Send validation errors from Yup
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await sequelize.query(
      "Select p.id,p.title,p.content,u.username,p.image,c.name catagories ,p.status as status,p.updatedAt,p.createdAt from posts as p inner join users as u on p.author_id = u.id inner join categories as c on  p.category_id = c.id ",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get pending posts for verification
export const getPendingPosts = async (req, res) => {
  try {
    const pendingPosts = await sequelize.query(
      "Select p.id,p.title,p.content,u.username,c.name catagories ,p.status as status,p.updatedAt,p.createdAt from posts as p inner join users as u on p.author_id = u.id inner join categories as c on  p.category_id = c.id where status = 'pending'",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!pendingPosts || pendingPosts.length === 0) {
      return res.status(200).json({ message: "No pending posts found" });
    }
    res.json(pendingPosts);
    console.log("pendingPosts");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch pending posts" });
  }
};

// Verify a post (approve/reject)
export const verifyPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { status } = req.body;

    // Ensure status is either 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Update the post status to either 'approved' or 'rejected'
    const updateResult = await sequelize.query(
      "UPDATE posts SET status = :status WHERE id = :id AND status = 'pending'",
      {
        replacements: { status, id: postId },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (updateResult[0] === 0) {
      return res
        .status(404)
        .json({ error: "Post not found or already processed" });
    }

    await sequelize.query(
      "INSERT INTO post_verification (post_id, verified_by, status) VALUES (:post_id, :verified_by, :status)",
      {
        replacements: {
          post_id: postId,
          verified_by: req.user.userId,
          status,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.json({ message: `Post ${status} successfully` });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Check if the post exists in the database
    const post = await sequelize.query("SELECT * FROM posts WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (post.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log(`Post ID to delete: ${id}`);
    const result = await sequelize.query("DELETE FROM posts WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE,
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

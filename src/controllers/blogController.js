import Post from "../models/PostModel.js";
import PostVerification from "../models/PostVerificationModel.js";

/** Admin Controllers **/
export const getPosts = async (req, res) => {
  try {
    const posts = await sequelize.query("SELECT * FROM posts", {
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await sequelize.query("SELECT * FROM posts WHERE id = :id", {
      replacements: { id: req.params.id },
      type: sequelize.QueryTypes.SELECT,
    });
    if (!post || post.length === 0)
      return res.status(404).json({ error: "Post not found" });
    res.json(post[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, category_id } = req.body;
    const author_id = req.user.userId;

    const result = await sequelize.query(
      "INSERT INTO posts (title, content, author_id, category_id) VALUES (:title, :content, :author_id, :category_id)",
      {
        replacements: { title, content, author_id, category_id },
        type: sequelize.QueryTypes.INSERT,
      }
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { title, content, category_id } = req.body;
    const postId = req.params.id;

    const result = await sequelize.query(
      "UPDATE posts SET title = :title, content = :content, category_id = :category_id WHERE id = :id",
      {
        replacements: { title, content, category_id, id: postId },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (result[0] === 0)
      return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await sequelize.query("DELETE FROM posts WHERE id = :id", {
      replacements: { id: postId },
      type: sequelize.QueryTypes.DELETE,
    });

    if (result[0] === 0)
      return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

/** Super Admin Controllers **/

// Get pending posts for verification
export const getPendingPosts = async (req, res) => {
  try {
    const pendingPosts = await Post.findAll({ where: { status: "pending" } });
    res.json(pendingPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending posts" });
  }
};

// Verify a post (approve/reject)
export const verifyPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Update the post status
    await sequelize.query("UPDATE posts SET status = :status WHERE id = :id", {
      replacements: { status, id: postId },
      type: sequelize.QueryTypes.UPDATE,
    });

    // Insert a record in PostVerification table
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

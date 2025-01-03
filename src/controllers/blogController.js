import Post from "../models/PostModel.js";
// import PostVerification from "../models/PostVerificationModel.js";
import sequelize from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/** Admin Controllers **/

export const getPostById = async (req, res) => {
  try {
    const post = await sequelize.query("SELECT * FROM posts WHERE id = :id", {
      replacements: { id: req.params.id },
      type: sequelize.QueryTypes.SELECT,
    });
    if (!post || post.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const getPostswithoutpending = async (req, res) => {
  try {
    const posts = await sequelize.query(
      `Select 
      p.id,p.title,p.content,u.username,p.image,c.name ascatagories ,
      p.status as status,p.updatedAt,p.createdAt 
      from posts as p 
      inner join users as u on p.author_id = u.id 
      inner join categories as c on  p.category_id = c.id 
      where status != 'pending' && status!= 'rejected'`,
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

// Create post function
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const createPost = async (req, res) => {
  try {
    const { title, content, category_id } = req.body;
    const author_id = req.user.userId;
    console.log(req.body);

    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Define a common upload directory
    const uploadDir = path.join(__dirname, "_Adminuploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalFilePath = req.file.path;
    const finalFilePath = path.join(
      uploadDir,
      `${Date.now()}-${req.file.originalname}`
    );
    fs.renameSync(originalFilePath, finalFilePath);

    // Create a new post record and store the image path in the database
    const newPost = await Post.create({
      title,
      content,
      author_id,
      category_id,
      image_data: finalFilePath,
      status: "pending",
    });

    res.status(201).json({
      message: "Post created and waiting for verification",
      postId: newPost.id,
      imagePath: finalFilePath,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, category_id } = req.body;
    const postId = req.params.id;

    // Ensure only admins can update posts
  
    // Fetch post to ensure it exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let updatedFields = {
      title,
      content,
      category_id,
      status: "pending", // Only admins can update, so set status to "pending"
    };

    if (req.file) {
      const uploadDir = path.join(__dirname, "./uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const originalFilePath = req.file.path;
      const finalFilePath = path.join(
        uploadDir,
        `${Date.now()}-${req.file.originalname}`
      );
      fs.renameSync(originalFilePath, finalFilePath);

      updatedFields.image = finalFilePath;

      if (post.image && fs.existsSync(post.image)) {
        fs.unlinkSync(post.image);
      }
    }

    await Post.update(updatedFields, { where: { id: postId } });

    res.json({
      message: "Post updated and set to pending for verification",
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
};

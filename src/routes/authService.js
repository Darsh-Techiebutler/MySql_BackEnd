import jwt from "jsonwebtoken";
import { registrationSchema, loginSchema } from "../validators/userValidator.js";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config(); // Ensure environment variables are loaded
const secratekey = process.env.JWT_SECRET || "ergenrii3rjgj3r";
const router = express.Router();

// Login Route with Raw Query
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Raw query to fetch user by email
    const [user] = await sequelize.query(
      "SELECT * FROM users WHERE email = :email LIMIT 1",
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
console.log("PRocess env",process.env.JWT_SECRET)
    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secratekey,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  try {
    // Validate request body using the existing registrationSchema
    await registrationSchema.validate(req.body, { abortEarly: false });

    const { username, email, password, role } = req.body;

    // Check if the email already exists in the database
    const existingUser = await sequelize.query(
      "SELECT * FROM users WHERE email = :email",
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "User already registered with this email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Raw query to insert user
    await sequelize.query(
      "INSERT INTO users (username, email, password, role, createdAt, updatedAt) VALUES (:username, :email, :password, :role, NOW(), NOW())",
      {
        replacements: { username, email, password: hashedPassword, role },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

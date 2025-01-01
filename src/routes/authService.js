import jwt from "jsonwebtoken";
import {
  registrationSchema,
  loginSchema,
} from "../validators/userValidator.js";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const secratekey = process.env.JWT_SECRET || "ergenrii3rjgj3r";
const router = express.Router();

// Login Route with Raw Query
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Raw query to fetch user by email
    const users = await sequelize.query(
      "SELECT * FROM users WHERE email = :email LIMIT 1",
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, secratekey, {
      expiresIn: "1h",
    });

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
    // Validate the request body using Joi or your validation schema
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

    // Insert user using raw SQL query
    const result = await sequelize.query(
      `INSERT INTO users (username, email, password, role, createdAt, updatedAt) 
       VALUES (:username, :email, :password, :role, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      {
        replacements: { username, email, password: hashedPassword, role },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // Check if the result has a valid insert ID (depending on the database setup)
    if (result) {
      console.log("User inserted:", result);
      res.status(201).json({
        message: "User registered successfully",
      });
    } else {
      res.status(500).json({ error: "Failed to register user" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

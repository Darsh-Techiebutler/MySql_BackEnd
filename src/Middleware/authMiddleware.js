import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const secrate = process.env.JWT_SECRET || "ergenrii3rjgj3r";

// Middleware to verify JWT token and roles
const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
      const decoded = jwt.verify(token, secrate);

      req.user = decoded;
      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res
          .status(403)
          .json({ error: "You are not allowed to access this operation" });
      }

      next();
    } catch (err) {
      // Check if the error is related to token expiration
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: "Token has expired. Please log in again" });
      }

      console.log(err);
      res.status(400).json({ error: "Please log in with valid credentials" });
    }
  };
};

export { authMiddleware };

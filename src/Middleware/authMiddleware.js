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
          .json({ error: "You are not allowed to edit or update" });
      }

      // Use For a Custom Query
      // try {
      //   const decoded = jwt.verify(token, secrate);
      //   req.user = decoded;

      //   const [user] = await sequelize.query(
      //     "SELECT * FROM users WHERE id = :userId",
      //     {
      //       replacements: { userId: req.user.userId },
      //       type: sequelize.QueryTypes.SELECT,
      //     }
      //   );

      //   if (!user) {
      //     return res.status(404).json({ error: "User not found" });
      //   }

      //   // Check if the decoded user has the necessary role
      //   if (
      //     req.user.roles &&
      //     req.user.roles.length &&
      //     !req.user.roles.includes(user.role)
      //   ) {
      //     return res
      //       .status(403)
      //       .json({ error: "You are not allowed to edit or update" });
      //   }

      //   // Proceed with the next middleware or controller
      //   next(); // Use `next()` to continue to the next route handler
      // } catch (err) {
      //   res.status(500).json({ error: "Server error", details: err.message });
      // }

      next();
    } catch (err) {
      console.log(err)
      res.status(400).json({ error: "Please Login With Credentials" });
    }
  };
};

export { authMiddleware };

import sequelize from "../config/db.js";
// Get user by ID
export const getUserById = async (req, res) => {
    try {
      const [user] = await sequelize.query("SELECT * FROM users WHERE id = :id", {
        replacements: { id: req.params.id },
      });
  
      if (!user.length) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(user[0]);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
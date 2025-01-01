import sequelize from "../config/db.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const [users] = await sequelize.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" });
  }
};



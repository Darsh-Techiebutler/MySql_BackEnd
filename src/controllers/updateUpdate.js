import sequelize from "../config/db.js";
// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;  
    const { username, email, password, role } = req.body;
    console.log(id);
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const [result] = await sequelize.query(
      "UPDATE users SET username = :username, email = :email, role = :role WHERE id = :id",
      {
        replacements: { id, username, email, role },
      }
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

import sequelize from "../config/db.js";
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const [result] = await sequelize.query("DELETE FROM users WHERE id = :id", {
      replacements: { id },
    });

    if (!result.affectedRows) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

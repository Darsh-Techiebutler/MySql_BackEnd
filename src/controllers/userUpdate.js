import sequelize from "../config/db.js";
// Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Ensure `id` is coming from params
    const { username, email, role } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Ensure `id` is used in the replacement map
    const result = await sequelize.query(
      `UPDATE users 
       SET username = :username, email = :email, role = :role, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = :id`,
      {
        replacements: { id, username, email, role },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export { updateUser };

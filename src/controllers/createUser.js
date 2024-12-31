import sequelize from "../config/db.js";
// Create a new user
const createUser = async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
  
      await sequelize.query(
        "INSERT INTO users (username, email, password, role) VALUES (:username, :email, :password, :role)",
        {
          replacements: { username, email, password, role },
        }
      );
  
      res.status(201).json({ message: "User created" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };
  export { createUser };
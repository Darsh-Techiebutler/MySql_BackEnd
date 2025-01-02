import sequelize from "../config/db.js";
// Create a new user
const createUser = async (req, res) => {
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
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await sequelize.query(
      "INSERT INTO users (username, email, password, role) VALUES (:username, :email, :password, :role)",
      {
        replacements: { username, email, password: hashedPassword, role },
      }
    );

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export { createUser };

import bcrypt from "bcrypt";
import sequelize from "../config/db.js";
import { sendPasswordChangeEmail } from "../utilities/emailUtils.js";
const resetPasswordByEmail = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "Email and new password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database based on the email
    const [affectedRows] = await sequelize.query(
      "UPDATE users SET password = :password WHERE email = :email",
      {
        replacements: { email, password: hashedPassword },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    if(affectedRows !== 0){
      sendPasswordChangeEmail(email);
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "User with this email not found" });
    }
    

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
export { resetPasswordByEmail };

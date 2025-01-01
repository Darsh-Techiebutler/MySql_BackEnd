import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Must be a valid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 128],
          msg: "Password must be between 8 and 128 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "superadmin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

// Password comparison method
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Password hashing hook
User.addHook("beforeSave", async (user) => {
  try {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  } catch (error) {
    throw new Error("Password hashing failed");
  }
});

export default User;

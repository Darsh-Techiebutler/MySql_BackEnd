import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PostVerification = sequelize.define("PostVerification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Posts",
      key: "id",
    },
  },
  verified_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("approved", "rejected"),
    defaultValue: "approved",
    allowNull: false,
  },
  verifiedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default PostVerification;

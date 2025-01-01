import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./UserModel.js";
import Category from "./CategoryModel.js";

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Categories",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("draft", "pending", "approved", "rejected"),
    defaultValue: "draft",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
});

Post.belongsTo(User, { foreignKey: "author_id", as: "author" });
Post.belongsTo(Category, { foreignKey: "category_id", as: "category" });

export default Post;

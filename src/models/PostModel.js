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
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
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
  },
});

Post.belongsTo(User, { foreignKey: "author_id", as: "author" });
Post.belongsTo(Category, { foreignKey: "category_id", as: "category" });

export default Post;

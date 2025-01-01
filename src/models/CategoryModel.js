// CategoryModel.js
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Ensure you have db.js configured

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "categories",
  }
);

export default Category;

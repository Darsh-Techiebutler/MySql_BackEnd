import express from "express";
import bodyParser from "body-parser";
import { Sequelize } from "sequelize";
import config from "./config/config.js";
import authRoutes from "./routes/authService.js";
import { userRoutes } from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { blogRoutes } from "./routes/blogRoutes.js";
import { categoriesRoutes } from "./routes/categoriesRoutes.js";
import { supeadminlogRoutes } from "./routes/superadminBlogRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 1717;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sequelize = new Sequelize(
  `mysql://${config.mysql.username}:${config.mysql.password}@${config.mysql.host}:${config.mysql.port}/${config.mysql.database}`,
  {
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connected successfully");
  })
  .catch((err) => {
    console.error("MySQL connection error:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/blog", supeadminlogRoutes);
app.use("/api/Categories", categoriesRoutes);
// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

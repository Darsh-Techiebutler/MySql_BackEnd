import { Sequelize } from "sequelize";
import config from "./config.js";

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.username,
  config.mysql.password,
  {
    host: config.mysql.host,
    dialect: "mysql",
    port: config.mysql.port,
  }
);

export default sequelize;

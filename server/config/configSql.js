import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const ConfigDb = new Sequelize(
  process.env.MY_DB,
  process.env.MY_USER,
  process.env.MY_PASS,
  {
    host: process.env.MY_HOST,
    dialect: "mysql",
    logging: console.log,
  }
);

if (process.env.Sync === "true") {
  ConfigDb.sync({ force: true })
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((error) => {
      console.error("Error creating database & tables:", error);
    });
}

export default ConfigDb;

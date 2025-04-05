import { DataTypes, Sequelize } from "sequelize";
import ConfigDb from "../config/configSql.js";
//
// Auth model
//

const User = ConfigDb.define(
  "User",
  {
    UserId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "user",
  }
);

export default User;

import { DataTypes, Sequelize } from "sequelize";
import ConfigDb from "../config/configSql.js";

const ToDo = ConfigDb.define(
  "ToDo",
  {
    task_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    Folder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ToDoHeader: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    tableName: "tododata",
  }
);

export default ToDo;

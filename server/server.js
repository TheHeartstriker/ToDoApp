import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
//Importing the functions from the database file
import {
  GetUserId,
  GetToDoData,
  deleteTask,
  CreateToDo,
  GetFoldersById,
  UpdateTaskComplete,
  checkUsername,
  deleteFolder,
} from "./dbfunc.js";
//Import the authentication functions
import { authenticateJWT, login, signup } from "./auth.js";

//Intilizing the .env file and the express app
dotenv.config();
const app = express();
//Cors pool/options
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
//For the database connection
const pool = mysql.createPool({
  host: process.env.MY_HOST,
  user: process.env.MY_USER,
  password: process.env.MY_PASS,
  database: process.env.MY_DB,
});
//Configuring the cors and json and morgan
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
//Server intialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//The usersId and foldername are used to get the data from the database
let userIdGet = "";
let foldername = "";

//Gets task data based on user id and sends it to the front as a response
app.get("/api/getTododata", authenticateJWT, async (req, res) => {
  try {
    const data = await GetToDoData(userIdGet, foldername);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Loads the folder already created by the user via the user id
//The excluded folder is the 'default' aka the state where a user has no folder in which we dont need to get said folder
app.get("/api/getFolders", authenticateJWT, async (req, res) => {
  try {
    const toExclude = "";
    const data = await GetFoldersById(userIdGet, toExclude);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Checks if the username is already in use
app.post("/api/checkUsername", async (req, res) => {
  const { username } = req.body;
  try {
    const result = await checkUsername(username);
    if (result) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Sets the folder name to be used in the database
app.post("/api/setFolder", authenticateJWT, async (req, res) => {
  try {
    const folderNaming = req.body.folder;
    console.log(folderNaming);
    foldername = folderNaming;
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

// Simply sends a username and password to the database to be inserted
app.post("/api/signup", async (req, res) => {
  const { username, password, UserId } = req.body;
  try {
    userIdGet = UserId;
    await signup(username, password, UserId);
    const token = jwt.sign({ UserId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "Strict",
    });
    res.status(201).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

// Sends username and login to the database and if successful sends the user id back to the front
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await login(username, password);
    if (result) {
      const userId = await GetUserId(username, password);
      userIdGet = userId;
      const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("jwtToken", token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: "Strict",
      });
      res.status(200).send({ success: true });
    } else {
      res.status(401).send(false);
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

// POST route sends ToDo information to the database
app.post("/api/createToDo", authenticateJWT, async (req, res) => {
  const {
    Task: Header,
    Description: Description,
    TaskId: TaskId,
    Folder: Folder,
    completed: Completed,
  } = req.body;
  try {
    await CreateToDo(Header, Description, TaskId, userIdGet, Folder, Completed);
    res.status(201).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
// Delete route seeds the task id to be deleted
app.delete("/api/deleteToDo", authenticateJWT, async (req, res) => {
  const { Task: Id } = req.body;
  try {
    await deleteTask(Id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Deletes all tasks related to a folder therefore deleting the folder and contents
app.delete("/api/deleteFolder", authenticateJWT, async (req, res) => {
  const { folder: FolderName } = req.body;
  try {
    await deleteFolder(FolderName);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Updates the true or false value of the task aka if it is completed or not
app.put("/api/updateToDo", authenticateJWT, async (req, res) => {
  const { Task: TaskId } = req.body;
  try {
    await UpdateTaskComplete(TaskId);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

export { pool, userIdGet, foldername };

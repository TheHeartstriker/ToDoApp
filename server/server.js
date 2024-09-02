import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const app = express();
//Cors pool/options
const corsOptions = {
  origin: "http://localhost:5173",
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
//Configuring the cors and json
app.use(cors(corsOptions));
app.use(express.json());
//Server intialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let userIdGet = "";
let foldername = "";

app.post("/api/setFolder", async (req, res) => {
  try {
    const folderNaming = req.body.folder;
    console.log(folderNaming);
    foldername = folderNaming;
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

//Gets task data based on user id and sends it to the front as a response
app.get("/api/getTododata", async (req, res) => {
  try {
    const data = await GetToDoData(userIdGet, foldername);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Loads the folder already created by the user via the user id
app.get("/api/getFolders", async (req, res) => {
  try {
    const data = await GetFoldersById(userIdGet);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

// Simply sends a username and password to the database to be inserted
app.post("/api/signup", async (req, res) => {
  const { username, password, UserId } = req.body;
  try {
    await signup(username, password, UserId);
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
      res.status(200).send({ success: true, Id: userId });
    } else {
      res.status(401).send(false);
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

// POST route sends ToDo information to the database
app.post("/api/createToDo", async (req, res) => {
  const {
    Task: Header,
    Description: Description,
    TaskId: TaskId,
    UserId: UserId,
    Folder: Folder,
  } = req.body;
  try {
    await CreateToDo(Header, Description, TaskId, UserId, Folder);
    res.status(201).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
// Delete route seeds the task id to be deleted
app.delete("/api/deleteToDo", async (req, res) => {
  const { Task: Id } = req.body;
  try {
    await deleteTask(Id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

//Database functions
async function signup(username, password, id) {
  console.log(username, password, id);
  try {
    // Check if the username already exists
    const [rows] = await pool.query(`SELECT * FROM login WHERE UserName = ?`, [
      username,
    ]);
    //Username has to be unique
    if (rows.length > 0) {
      return false;
    }
    // Insert the new user
    const result = await pool.query(
      `INSERT INTO login (UserName, Pass_word, UserId) VALUES (?, ?, ?)`,
      [username, password, id]
    );

    return result;
  } catch (error) {
    throw error;
  }
}
//Login function
async function login(username, password) {
  try {
    const [results] = await pool.query(
      `SELECT * FROM login WHERE UserName = ? AND Pass_word = ?`,
      [username, password]
    );
    //If the username and password match
    if (results.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Database query failed", error);
  }
}
//Get user id function
async function GetUserId(username, password) {
  try {
    const [results] = await pool.query(
      `SELECT UserId FROM login WHERE UserName = ? AND Pass_word = ?`,
      [username, password]
    );
    if (results.length > 0) {
      return results[0].UserId;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Database query failed", error);
    throw error;
  }
}
//Sends back data that has the user id
async function GetToDoData(userid, folder) {
  try {
    const [results] = await pool.query(
      `SELECT * FROM tododata WHERE UserId = ? AND Folder = ?`,
      [userid, folder]
    );
    const data = results.map((row) => ({
      Task: row.ToDoHeader,
      Description: row.De_scription,
      TaskId: row.task_id,
    }));
    return data;
  } catch (error) {
    throw error;
  }
}
//Deletes a task based on the given task id
async function deleteTask(id) {
  try {
    const result = await pool.query(`DELETE FROM tododata WHERE task_id = ?`, [
      id,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
}
//Creates a new task
async function CreateToDo(Header, Description, taskid, UserId, Folder) {
  try {
    const result = pool.query(
      `INSERT INTO tododata (ToDoHeader, De_scription, task_id, UserId, Folder) VALUES (?, ?, ?, ?, ?)`,
      [Header, Description, taskid, UserId, Folder]
    );
    return result;
  } catch (error) {
    throw error;
  }
}
//Used so we can load the created folders
async function GetFoldersById(Userid) {
  try {
    const [results] = await pool.query(
      `SELECT * FROM tododata WHERE UserId = ?`,
      [Userid]
    );
    const data = results.map((row) => ({
      Folder: row.Folder,
    }));
    return data;
  } catch (error) {
    throw error;
  }
}

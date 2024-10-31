import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import morgan from "morgan"; // For logging if needed
//Intilizing the .env file and the express app
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
//Configuring the cors and json and morgan
app.use(cors(corsOptions));
app.use(express.json());
//Server intialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//The usersId and foldername are used to get the data from the database
let userIdGet = "";
let foldername = "";

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
//The excluded folder is the 'default' aka the state where a user has no folder in which we dont need to get said folder
app.get("/api/getFolders", async (req, res) => {
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
      res.status(401).send(false);
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Sets the folder name to be used in the database
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

// Simply sends a username and password to the database to be inserted
app.post("/api/signup", async (req, res) => {
  const { username, password, UserId } = req.body;
  try {
    userIdGet = UserId;
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
      res.status(200).send({ success: true });
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
app.delete("/api/deleteToDo", async (req, res) => {
  const { Task: Id } = req.body;
  try {
    await deleteTask(Id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Deletes all tasks related to a folder therefore deleting the folder and contents
app.delete("/api/deleteFolder", async (req, res) => {
  const { folder: FolderName } = req.body;
  try {
    await deleteFolder(FolderName);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});
//Updates the true or false value of the task aka if it is completed or not
app.put("/api/updateToDo", async (req, res) => {
  const { Task: TaskId } = req.body;
  try {
    await UpdateTaskComplete(TaskId);
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
      Folder: row.Folder,
      Completed: row.Completed,
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

//async function to delete the folder
async function deleteFolder(folder) {
  try {
    const result = await pool.query(`DELETE FROM tododata WHERE Folder = ?`, [
      folder,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
}
//Creates a new task
async function CreateToDo(
  Header,
  Description,
  taskid,
  UserId,
  Folder,
  Completed
) {
  try {
    const result = pool.query(
      `INSERT INTO tododata (ToDoHeader, De_scription, task_id, UserId, Folder, Completed) VALUES (?, ?, ?, ?, ?, ?)`,
      [Header, Description, taskid, UserId, Folder, Completed]
    );
    return result;
  } catch (error) {
    throw error;
  }
}
// Used so we can load the created folders
async function GetFoldersById(userId, excluded) {
  try {
    const [results] = await pool.query(
      `SELECT DISTINCT Folder FROM tododata WHERE UserId = ? AND Folder != ?`,
      [userId, excluded]
    );
    return results.map((row) => ({ Folder: row.Folder }));
  } catch (error) {
    console.error(`Error fetching folders for user ${userId}:`, error);
    throw error;
  }
}
//Updates the task state of either being completed or not
async function UpdateTaskComplete(TaskId) {
  try {
    const result = await pool.query(
      `UPDATE tododata SET Completed = NOT Completed WHERE task_id = ?`,
      [TaskId]
    );
    return result;
  } catch (error) {
    throw error;
  }
}
//Sees if the username is already in use
async function checkUsername(username) {
  try {
    const [results] = await pool.query(
      `SELECT * FROM login WHERE UserName = ?`,
      [username]
    );
    if (results.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

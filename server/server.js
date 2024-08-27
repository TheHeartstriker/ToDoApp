import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const app = express();

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

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/getTododata", async (req, res) => {
  try {
    const data = await getToDoDataByUserId(userIdGet);
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

//Relook at this later
let userIdGet = "";

// Sends username and login to the database sends if the login is successful 'true' and the user id if so
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

// POST route sends information to be inserted into the database
app.post("/api/createToDo", async (req, res) => {
  const {
    Task: Header,
    Description: Description,
    TaskId: TaskId,
    UserId: UserId,
  } = req.body;
  try {
    await CreateToDo(Header, Description, TaskId, UserId);
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
    console.log("Check User:", rows);

    if (rows.length > 0) {
      // Username already taken
      console.log("Username already taken");
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
async function login(username, password) {
  try {
    const [results] = await pool.query(
      `SELECT * FROM login WHERE UserName = ? AND Pass_word = ?`,
      [username, password]
    );
    console.log(username, password);
    if (results.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Database query failed", error);
  }
}

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

async function getToDoDataByUserId(userid) {
  try {
    const [results] = await pool.query(
      `SELECT * FROM tododata WHERE UserId = ?`,
      [userid]
    );
    const data = results.map((row) => ({
      Task: row.ToDoHeader,
      Description: row.De_scription,
      TaskId: row.task_id,
    }));
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}

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
async function CreateToDo(Header, Description, taskid, UserId) {
  try {
    const result = pool.query(
      `INSERT INTO tododata (ToDoHeader, De_scription, task_id, UserId) VALUES (?, ?, ?, ?)`,
      [Header, Description, taskid, UserId]
    );
    return result;
  } catch (error) {
    throw error;
  }
}

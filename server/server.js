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

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let userIdGet = "";

app.get("/api/getTododata", async (req, res) => {
  try {
    const data = await getToDoDataByUserId(userIdGet);
    console.log("ToDo data held by user", data);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
});

// Reciving signup data
app.post("/api/signup", (req, res) => {
  const { username, password, UserId } = req.body;
  console.log(username, password, UserId);
  signup(username, password, UserId);
});

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

// POST route to handle incoming data
//You likely put limits on the useid thats why its not working
app.post("/api/createToDo", (req, res) => {
  const {
    Task: Header,
    Description: Description,
    TaskId: TaskId,
    UserId: UserId,
  } = req.body;

  console.log("Sent to server" + Header);
  CreateToDo(Header, Description, TaskId, UserId);
});

app.delete("/api/deleteToDo", (req, res) => {
  const { Task: Id } = req.body;
  console.log("Delete request for task id: ", Id);
  deleteTask(Id);
  res.status(200).send("Data deleted"); // Send the updated temptask as the response
});

const pool = mysql.createPool({
  host: process.env.MY_HOST,
  user: process.env.MY_USER,
  password: process.env.MY_PASS,
  database: process.env.MY_DB,
});
//Need to make sure a newly created id is not already in use
function signup(username, password, id) {
  return pool.query(
    `INSERT INTO login (UserName, Pass_word, UserId) VALUES (?, ?, ?)`,
    [username, password, id]
  );
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

function deleteTask(id) {
  return pool.query(`DELETE FROM tododata WHERE task_id = ?`, [id]);
}

async function getToDoDataByUserId(userid) {
  try {
    const [results] = await pool.query(
      `SELECT * FROM tododata WHERE UserId = ?`,
      [userid]
    );
    const data = results.map((row) => ({
      Header: row.ToDoHeader,
      Description: row.De_scription,
      TaskId: row.task_id,
    }));
    return data;
  } catch (error) {
    throw error;
  }
}

function CreateToDo(Header, Description, taskid, UserId) {
  return pool.query(
    `INSERT INTO tododata (ToDoHeader, De_scription, task_id, UserId) VALUES (?, ?, ?, ?)`,
    [Header, Description, taskid, UserId]
  );
}

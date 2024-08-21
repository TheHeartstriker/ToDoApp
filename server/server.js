import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Adjust this to your client's origin
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

// Reciving signup data
app.post("/api/signup", (req, res) => {
  const { username, password, UserId } = req.body;
  console.log(username, password, UserId);
  signup(username, password, UserId);
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  login(username, password);
});

// POST route to handle incoming data
//You likely put limits on the useid thats why its not working
app.post("/api/createToDo", (req, res) => {
  const { Task: Header, Description: Description, Id: userid } = req.body;

  console.log("Sent to server" + Header);
  CreateToDo(Header, Description, userid);
});

app.delete("/api/deleteToDo", (req, res) => {
  const { index } = req.body;
  temptask = temptask.filter((task) => task.index !== index);
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
      console.log("Login successful");
    } else {
      console.log("Login failed");
    }
  } catch (error) {
    console.error("Database query failed", error);
  }
}

function deleteTask(id) {
  return pool.query(`DELETE FROM tododata WHERE task_id = ?`, [id]);
}

function getToDoDataByUserId(userid) {
  return pool.query(`SELECT * FROM tododata WHERE UserId = ?`, [userid]);
}

function CreateToDo(Header, Description, taskid) {
  return pool.query(
    `INSERT INTO tododata (ToDoHeader, De_scription, task_id) VALUES (?, ?, ?)`,
    [Header, Description, taskid]
  );
}

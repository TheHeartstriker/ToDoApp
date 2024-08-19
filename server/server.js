import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

let temptask = [];
// Reciving signup data
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  console.log("Username:", username);
});

app.get("/api/login", (req, res) => {
  res.status(200).send(temptask);
});

// POST route to handle incoming data
app.post("/api/createToDo", (req, res) => {
  console.log("Data received:", req.body);
  temptask.push(req.body);
  res.status(200).send("Data received");
});

app.delete("/api/deleteToDo", (req, res) => {
  const { index } = req.body;
  temptask = temptask.filter((task) => task.index !== index);
  res.status(200).send("Data deleted"); // Send the updated temptask as the response
});

//This is used for when a delete request is made and a reorganization is needed
app.put("/api/organize", (req, res) => {
  temptask = temptask.map((task, i) => ({ ...task, index: i }));
  console.log(temptask);
  res.status(200).send("Data organized"); // Send the updated temptask as the response
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
    `INSERT INTO userdata (UserName, Pass_word, UserId) VALUES (?, ?, ?)`,
    [username, password, id]
  );
}

function CreateToDo(Header, Description, index, userid) {
  return pool.query(
    `INSERT INTO tododata (ToDoHeader, De_scription, index_pos, UserId) VALUES (?, ?, ?, ?)`,
    [Header, Description, index, userid]
  );
}

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

let temptask = [];

// POST route to handle incoming data
app.post("/api", (req, res) => {
  console.log("Data received:", req.body);
  temptask.push(req.body);
  res.status(200).send("Data received");
});

app.delete("/api", (req, res) => {
  const { index } = req.body;
  temptask = temptask.filter((task) => task.index !== index);
  res.status(200).send("Data deleted"); // Send the updated temptask as the response
});

app.put("/api", (req, res) => {
  temptask = temptask.map((task, i) => ({ ...task, index: i }));
  console.log(temptask);
  res.status(200).send("Data organized"); // Send the updated temptask as the response
});

console.log(temptask); // Log the temptask to the console

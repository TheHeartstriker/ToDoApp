import express from "express";

const app = express();

app.get("/api", (req, res) => {
  res.json({ Users: ["User 1", "User 2", "User 3"] });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// POST route to handle incoming data
app.post("/api/data", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  res.status(200).send("Data received");
});

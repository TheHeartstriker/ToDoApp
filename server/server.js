import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// POST route to handle incoming data
app.post("/api", (req, res) => {
  console.log("Data received:", req.body);
  res.status(200).send("Data received");
});

//Set up a get route and preloaded data for testing

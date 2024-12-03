import { pool } from "./server.js";
import jwt from "jsonwebtoken";

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

async function authenticateJWT(req, res, next) {
  const token = req.cookies.jwtToken;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export { signup, login, authenticateJWT };

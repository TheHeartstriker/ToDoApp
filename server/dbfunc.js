import { pool } from "./server.js";
//Database functions
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

export {
  GetUserId,
  GetToDoData,
  deleteTask,
  CreateToDo,
  GetFoldersById,
  UpdateTaskComplete,
  checkUsername,
  deleteFolder,
};

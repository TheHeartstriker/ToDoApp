import { Router } from "express";

import { login, register } from "./controllers/authControler.js";
import { authenticate } from "./middleWare/authMiddle.js";
import { getFolders, deleteFolder } from "./controllers/folderControler.js";
import {
  createTask,
  loadTasks,
  updateTaskComplete,
  deleteTask,
} from "./controllers/toDoControler.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/createToDo", authenticate, createTask);
router.get("/getFolders", authenticate, getFolders);
router.get("/getTododata", authenticate, loadTasks);
router.delete("/deleteFolder", authenticate, deleteFolder);
router.delete("/deleteToDo", authenticate, deleteTask);
router.put("/updateToDo", authenticate, updateTaskComplete);
router.get("/validate", authenticate, (req, res) => {
  res.status(200).json({ message: "Token is valid", success: true });
});

export default router;

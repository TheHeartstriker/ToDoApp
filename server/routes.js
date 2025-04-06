import { Router } from "express";

import { login, register } from "./controllers/authControler.js";
import { authenticate } from "./middleWare/authMiddle.js";
import {
  getFolders,
  deleteFolder,
  createTask,
} from "./controllers/toDoControler.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getFolders", authenticate, getFolders);
router.delete("/deleteFolder", authenticate, deleteFolder);
router.post("/createToDo", authenticate, createTask);
router.get("/validate", authenticate, (req, res) => {
  res.status(200).json({ isAuthenticated: true });
});

export default router;

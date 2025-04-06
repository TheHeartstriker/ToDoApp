import ToDo from "../models/ToDoModel.js";
import { v4 as uuidv4 } from "uuid";

async function getFolders(req, res, next) {
  try {
    const { folder } = req.body;
    const userId = req.user.id;
    //Input validation
    if (typeof folder !== "string" || folder.length < 39) {
      return res
        .status(400)
        .json({ message: "Invalid format len or type", success: false });
    }
    //Find all realted folders
    const folders = await ToDo.findAll({
      where: {
        folder: { [Op.ne]: "" },
        userId: userId,
      },
      atrributes: { exlude: ["userId"] },
    });
    //Check if folders exist
    if (!folders) {
      return res
        .status(404)
        .json({ message: "No folders found", success: false });
    }

    res.status(200).json({ folders, success: true });
  } catch (error) {
    next(error);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const { folderName } = req.body;
    userId = req.user.id;
    //Input validation
    if (typeof folderName !== "string" || folderName.length < 39) {
      return res
        .status(400)
        .json({ message: "Invalid format len or type", success: false });
    }

    //Delete folder
    const folder = await ToDo.destroy({
      where: {
        folder: folderName,
        userId: userId,
      },
    });
    //Check if folder exists
    if (!folder) {
      return res
        .status(404)
        .json({ message: "Folder not found", success: false });
    }
    res.status(200).json({ message: "Folder deleted", success: true });
  } catch {
    next(error);
  }
}

async function loadTasks(req, res, next) {
  try {
    const { folderName } = req.body;
    userId = req.user.id;
    //Input validation
    if (typeof folderName !== "string" || folderName.length < 39) {
      return res
        .status(400)
        .json({ message: "Invalid format len or type", success: false });
    }
    //Load tasks
    const tasks = await ToDo.findAll({
      where: {
        folder: folderName,
        userId: userId,
      },
      atrributes: { exlude: ["userId"] },
    });
    //Check if tasks exist
    if (!tasks) {
      return res
        .status(404)
        .json({ message: "No tasks found", success: false });
    }
    res.status(200).json({ tasks, success: true });
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { taskId } = req.body;
    userId = req.user.id;
    //Input validation
    if (typeof taskId !== "string" || taskId.length < 39) {
      return res
        .status(400)
        .json({ message: "Invalid format len or type", success: false });
    }
    //Delete task
    const task = await ToDo.destroy({
      where: {
        task_id: taskId,
        userId: userId,
      },
    });
    //Check if task exists
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    res.status(200).json({ message: "Task deleted", success: true });
  } catch (error) {
    next(error);
  }
}

async function updateTaskComplete(req, res, next) {
  try {
    const { taskId } = req.body;
    const userId = req.user.id;

    // Input validation
    if (typeof taskId !== "string" || taskId.length < 39) {
      return res
        .status(400)
        .json({ message: "Invalid format len or type", success: false });
    }

    // Find the task to get its current Completed status
    const task = await ToDo.findOne({
      where: {
        task_id: taskId,
        userId: userId,
      },
    });

    // Check if task exists
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }

    // Toggle the Completed status
    const updatedTask = await ToDo.update(
      { Completed: !task.Completed },
      {
        where: {
          task_id: taskId,
          userId: userId,
        },
      }
    );

    res.status(200).json({ message: "Task updated", success: true });
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { Task, Description, Folder } = req.body;
    const userId = req.user.id;

    // Input validation
    if (
      typeof Task !== "string" ||
      Task.length > 149 || // Corrected length check
      typeof Description !== "string" ||
      typeof Folder !== "string" ||
      Folder.length > 39 // Corrected length check
    ) {
      return res
        .status(400)
        .json({ message: "Invalid format length or type", success: false });
    }

    // Attempt to create the task
    const task = await ToDo.create({
      task_id: uuidv4(),
      ToDoHeader: Task,
      Description: Description,
      Folder: Folder,
      Completed: false,
      UserId: userId,
    });

    // Check if task was created successfully
    if (!task || !task.task_id) {
      return res
        .status(500)
        .json({ message: "Failed to create task", success: false });
    }

    res.status(201).json({ message: "Task created", success: true });
  } catch (error) {
    next(error);
  }
}

export {
  getFolders,
  deleteFolder,
  loadTasks,
  deleteTask,
  updateTaskComplete,
  createTask,
};

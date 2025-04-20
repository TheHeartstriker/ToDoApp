import ToDo from "../models/ToDoModel.js";
import { v4 as uuidv4 } from "uuid";
import { validateData } from "../utils/dataValidation.js";

async function loadTasks(req, res, next) {
  try {
    const userId = req.user.id;
    const folderName = req.query.foldername;
    //Input validation
    console.log(folderName);
    const validate = [{ folderName: folderName }];
    validateData(validate, [["folderName", "string", 249]]);
    //Load tasks
    const tasks = await ToDo.findAll({
      where: {
        folder: folderName,
        userId: userId,
      },
      attributes: { exclude: ["UserId"] },
    });
    //Check if tasks exist
    if (!tasks || tasks.length === 0) {
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
    const { Task } = req.body;
    const userId = req.user.id;
    //Input validation
    const validate = [{ Task: Task }];
    validateData(validate, [["Task", "string", 36]]);
    //Delete task
    const task = await ToDo.destroy({
      where: {
        task_id: Task,
        userId: userId,
      },
    });
    //Check if task exists
    if (!task || task.length === 0) {
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
    const { task_id } = req.body;
    const userId = req.user.id;

    // Input validation
    const validate = [{ task_id: task_id }];
    validateData(validate, [["task_id", "string", 36]]);

    // Find the task to get its current Completed status
    const task = await ToDo.findOne({
      where: {
        task_id: task_id,
        userId: userId,
      },
    });
    // Check if task exists
    if (!task || task.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    // Toggle the Completed status
    const updatedTask = await ToDo.update(
      { Completed: !task.Completed },
      {
        where: {
          task_id: task_id,
          userId: userId,
        },
      }
    );
    // Check if the update was successful
    if (!updatedTask || updatedTask.length === 0) {
      return res
        .status(500)
        .json({ message: "Failed to update task", success: false });
    }

    res.status(200).json({ message: "Task updated", success: true });
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { ToDoHeader, Description, Folder } = req.body;
    const userId = req.user.id;
    const validate = [
      { ToDoHeader: ToDoHeader, Description: Description, Folder: Folder },
    ];
    validateData(validate, [
      ["ToDoHeader", "string", 249],
      ["Description", "string", 249],
      ["Folder", "string", 249],
    ]);
    // Attempt to create the task
    const task = await ToDo.create({
      task_id: uuidv4(),
      ToDoHeader: ToDoHeader,
      Description: Description,
      Folder: Folder,
      Completed: false,
      UserId: userId,
    });
    // Check if task was created successfully
    if (!task || task.length === 0) {
      return res
        .status(500)
        .json({ message: "Failed to create task", success: false });
    }
    res.status(201).json({ message: "Task created", success: true });
  } catch (error) {
    next(error);
  }
}

export { loadTasks, deleteTask, updateTaskComplete, createTask };

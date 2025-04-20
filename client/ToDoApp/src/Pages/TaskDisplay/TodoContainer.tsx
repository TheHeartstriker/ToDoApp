import { useState, useEffect, useContext } from "react";
import { TaskContext, Contexts } from "../../Components/TaskProvider";
import { taskStuct } from "../../Types/Provider";
import {
  loadTaskData,
  deleteTask,
  updateTaskComplete,
} from "../../Services/toDoApi";

interface ExtendedTask extends taskStuct {
  inspect?: boolean;
  Index: number;
}

function Container() {
  //Something is wrong in here that causes data that is loaded from the server to need another render to show up
  //Main task data thats given to the server
  const [taskData, setTaskData] = useState<taskStuct[]>([]);
  //Check if we need to request things of the server
  //Folder name that we are currently in
  const { foldername, setFoldername } = useContext(TaskContext) as Contexts;
  //Local used so we dont save or send unnecessary data to the server
  const [LocalTaskData, setLocalTaskData] = useState<ExtendedTask[]>([]);
  //Delete request to server

  async function fetchTaskData() {
    try {
      const data = await loadTaskData(foldername);
      setTaskData(data.tasks);
    } catch (error) {
      console.error("Error loading task data:", error);
    }
  }

  //Removes a task filters out the task that needs to be removed
  //By id from the main data and index from the local data
  function removeTask(index: number, id: string) {
    // Local remove task
    setLocalTaskData(function (prevLocalTaskData) {
      return prevLocalTaskData.filter(function (t) {
        return t.task_id !== index;
      });
    });

    // Remove task from main data
    setTaskData(function (prevTaskData) {
      return prevTaskData.filter(function (t) {
        return t.task_id !== id;
      });
    });

    deleteTask(taskData[index].task_id);
  }
  //Change the true or false value of the task completed for local and main data
  //Send data to the server if we are signed in
  function Completed(index: number) {
    setTaskData(function (prevTaskData) {
      return prevTaskData.map(function (task, i) {
        return i === index ? { ...task, Completed: !task.Completed } : task;
      });
    });
    setLocalTaskData(function (prevLocalTaskData) {
      return prevLocalTaskData.map(function (task, i) {
        return i === index ? { ...task, Completed: !task.Completed } : task;
      });
    });
    console.log("Completed", LocalTaskData[index]);
    updateTaskComplete(taskData[index].task_id);
  }

  //Inspect task value becomes true or false if true
  function Inspect(index: number) {
    setLocalTaskData(function (prevLocalTaskData) {
      return prevLocalTaskData.map(function (task, i) {
        return i === index ? { ...task, inspect: !task.inspect } : task;
      });
    });
  }
  //Every time the task data changes(when we remove a task) we re run
  useEffect(() => {
    if (!taskData) return;
    const extendedTaskData = taskData.map((task, i) => {
      const existingTask = LocalTaskData.find(
        (t) => t.task_id === task.task_id
      );
      return {
        ...task,
        Index: i,
        inspect: existingTask ? existingTask.inspect : false,
      };
    });
    setLocalTaskData(extendedTaskData);
  }, [taskData]);
  //If we are signed in we load the data from the server
  useEffect(() => {
    fetchTaskData();
  }, [foldername]);

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {LocalTaskData.map((item, index) => (
        <div
          key={item.task_id}
          className={`Task ${item.inspect ? "inspected" : ""}`}
        >
          <h3>{item.ToDoHeader}</h3>
          {!item.inspect && (
            <input
              type="checkbox"
              className="CheckBtn"
              checked={item.Completed ?? false}
              onChange={() => Completed(item.Index)}
            />
          )}
          {item.inspect && (
            <button
              className="DeleteBtn"
              onClick={() => removeTask(item.Index, item.task_id)}
            >
              Delete
            </button>
          )}
          {item.inspect && <p>{item.Description}</p>}
          <div className="Inspect">
            <button onClick={() => Inspect(item.Index)}></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Container;

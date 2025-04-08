import { useState, useEffect, useContext } from "react";
import { TaskContext, Contexts } from "../../Components/TaskProvider";
import { taskStuct } from "../../Types/Provider";

interface ExtendedTask extends taskStuct {
  inspect?: boolean;
  Index: number;
}

function Container() {
  //Something is wrong in here that causes data that is loaded from the server to need another render to show up
  //Main task data thats given to the server
  const { taskData, setTaskData } = useContext(TaskContext) as Contexts;
  //Check if we need to request things of the server
  //Folder name that we are currently in
  const { foldername, setFoldername } = useContext(TaskContext) as Contexts;
  //Local used so we dont save or send unnecessary data to the server
  const [LocalTaskData, setLocalTaskData] = useState<ExtendedTask[]>([]);
  //Load task info from server
  async function loadTaskfromServer(): Promise<void> {
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
    };
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/getTododata?foldername=${encodeURIComponent(foldername)}`,
        options
      );
      const data = await response.json();
      console.log("Response from server:", data.tasks, data.message);
      setTaskData(data.tasks);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  //Delete request to server
  async function IfSignDelete(index: number): Promise<void> {
    let options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({ Task: LocalTaskData[index].task_id }),
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/deleteToDo`,
        options
      );
      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function UpdataTaskComplete(task_id: string): Promise<void> {
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({ task_id }),
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/updateToDo`,
        options
      );
      const data = await response.json();
      console.log("Response from server:", data, data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function LoadTaskData(Folder: string) {
    const extendedTaskData = taskData.map((task, index) => ({
      ...task,
      Index: index,
      inspect: false,
    }));
    setLocalTaskData(extendedTaskData);
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

    IfSignDelete(index);
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
    UpdataTaskComplete(LocalTaskData[index].task_id);
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
    loadTaskfromServer();
  }, []);

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

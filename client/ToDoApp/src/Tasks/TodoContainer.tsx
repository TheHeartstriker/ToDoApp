import { useState, useEffect, useContext } from "react";
import { TaskContext, Contexts } from "../TaskProvider";
import { taskStuct } from "../Provider";

interface ExtendedTask extends taskStuct {
  inspect?: boolean;
  Index: number;
}

function Container() {
  //Something is wrong in here that causes data that is loaded from the server to need another render to show up
  //Main task data thats given to the server
  const { taskData, setTaskData } = useContext(TaskContext) as Contexts;
  //Check if we need to request things of the server
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext) as Contexts;
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
        `${import.meta.env.VITE_API_BASE_URL}/api/getTododata`,
        options
      );
      const data = await response.json();
      console.log(data);
      setTaskData(data);
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
      body: JSON.stringify({ Task: LocalTaskData[index].TaskId }),
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/deleteToDo`,
        options
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function UpdataTaskComplete(TaskId: string): Promise<void> {
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({ Task: TaskId }),
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/updateToDo`,
        options
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function LoadTaskData(Folder: string) {
    const extendedTaskData = taskData
      .filter((task) => task.Folder === Folder)
      .map((task, index) => ({
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
        return t.TaskId !== index;
      });
    });

    // Remove task from main data
    setTaskData(function (prevTaskData) {
      return prevTaskData.filter(function (t) {
        return t.TaskId !== id;
      });
    });

    if (isSignedIn) {
      IfSignDelete(index);
    }
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
    if (isSignedIn) {
      UpdataTaskComplete(LocalTaskData[index].TaskId);
    }
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
    const extendedTaskData = taskData.map((task, i) => ({
      ...task,
      Index: i,
      inspect: false,
    }));
    setLocalTaskData(extendedTaskData);
  }, [taskData]);
  //If we are signed in we load the data from the server
  useEffect(() => {
    if (isSignedIn) {
      loadTaskfromServer();
    } else {
      LoadTaskData(foldername);
    }
  }, [isSignedIn, taskData]);

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {LocalTaskData.map((item, index) => (
        <div
          key={item.TaskId}
          className={`Task ${item.inspect ? "inspected" : ""}`}
        >
          <h3>{item.Task}</h3>
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
              onClick={() => removeTask(item.Index, item.TaskId)}
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

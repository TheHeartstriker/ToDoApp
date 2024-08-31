import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskProvider";
function Container() {
  //Main task data thats given to the server
  const { taskData, setTaskData } = useContext(TaskContext);
  //Check if we need to request things of the server
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);
  //Local used so we dont save or send unnecessary data to the server
  const [LocalTaskData, setLocalTaskData] = useState(taskData);
  //Load task info from server
  async function loadTaskfromServer() {
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/getTododata",
        options
      );
      const data = await response.json();
      setTaskData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  //Delete request to server
  async function IfSignDelete(index) {
    let options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Task: LocalTaskData[index].TaskId }),
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/deleteToDo",
        options
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //Removes a task filters out the task that needs to be removed
  //By id from the main data and index from the local data
  function removeTask(index, id) {
    // Local remove task
    setLocalTaskData(function (prevLocalTaskData) {
      return prevLocalTaskData.filter(function (t) {
        return t.Index !== index;
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

    // When task is removed, organize the index
    IndexOrganize();
  }

  //Organize index so we can easily locate tasks
  function IndexOrganize() {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) => ({ ...task, index: i }))
    );
  }

  //Add inspect to all local tasks
  function AddInspect() {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) => ({ ...task, inspect: false }))
    );
  }
  //Inspect task value becomes true or false if true
  function Inspect(index) {
    setLocalTaskData(function (prevLocalTaskData) {
      return prevLocalTaskData.map(function (task, i) {
        return i === index ? { ...task, inspect: !task.inspect } : task;
      });
    });
  }
  //Add index to all to local tasks
  function addIndexs() {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) => ({ ...task, Index: i }))
    );
  }
  //Every time the task data changes(when we remove a task) we re run
  useEffect(() => {
    addIndexs();
    AddInspect();
    console.log("Taskdata", taskData);
  }, [taskData]);
  //If we are signed in we load the data from the server
  useEffect(() => {
    if (isSignedIn) {
      loadTaskfromServer();
    }
  }, []);

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {LocalTaskData.map((item, index) => (
        <div
          key={item.TaskId}
          className={`grid-item ${item.inspect ? "inspected" : ""}`}
        >
          <h1>{item.Task}</h1>
          {item.inspect && <p>{item.Description}</p>}
          <div className="TaskLeft">
            <button
              onClick={() => removeTask(item.Index, item.TaskId)}
            ></button>
          </div>
          <div className="TaskRight">
            <button onClick={() => Inspect(item.Index)}></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Container;

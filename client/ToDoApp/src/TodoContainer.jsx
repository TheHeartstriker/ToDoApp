import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskProvider";
function Container() {
  //Main task data
  const { taskData, setTaskData } = useContext(TaskContext);
  const { userId } = useContext(TaskContext);
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);
  //Local used so we dont save or send unnecessary data to the server
  const [LocalTaskData, setLocalTaskData] = useState(taskData);

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
      console.log("Response from server:", data);
      setTaskData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
      const data = await response.text();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //Delete request
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

  //Organize index
  function IndexOrganize() {
    // Local organize
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
  //Inspect task value becomes true
  function Inspect(index) {
    setLocalTaskData(function (prevLocalTaskData) {
      return prevLocalTaskData.map(function (task, i) {
        return i === index ? { ...task, inspect: !task.inspect } : task;
      });
    });
  }

  function addIndexs() {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) => ({ ...task, Index: i }))
    );
  }
  //There is an issue where only when loaded are index and inspect values added
  //But new data is left out
  //Fixed?
  useEffect(() => {
    setLocalTaskData(taskData);
    addIndexs();
    AddInspect();
  }, [taskData]);

  useEffect(() => {
    if (isSignedIn) {
      loadTaskfromServer();
    }
  }, []);

  useEffect(() => {
    console.log(LocalTaskData);
  }, [taskData]);

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {LocalTaskData.map((item, index) => (
        <div
          key={item.Index}
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

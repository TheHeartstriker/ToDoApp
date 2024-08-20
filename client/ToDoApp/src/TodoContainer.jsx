import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskProvider";
function Container() {
  //Main task data
  const { taskData, setTaskData } = useContext(TaskContext);
  //Local used so we dont save certain changes like inspect
  const [LocalTaskData, setLocalTaskData] = useState(taskData);

  //Delete request
  const removeTask = (index) => {
    //Local remove task
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.filter((t) => t.index !== index)
    );
    //Remove task from main data
    setTaskData((prevTaskData) =>
      prevTaskData.filter((t) => t.index !== index)
    );

    fetch("http://localhost:5000/api/deleteToDo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index: index }),
    })
      //Response checks
      .then((response) => response.text())
      .then((responseData) => {
        console.log("Response from server:", responseData);
      })
      //Error checks
      .catch((error) => {
        console.error("Error:", error);
      });

    //When task is removed, organize the index
    IndexOrganize();
  };
  //Organize index
  function IndexOrganize() {
    // Local organize
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) => ({ ...task, index: i }))
    );
    // Organize main index data
    setTaskData((prevTaskData) =>
      prevTaskData.map((task, i) => ({ ...task, index: i }))
    );

    // Send PUT request to notify the server to reorganize
    fetch("http://localhost:5000/api/organize", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      // Response checks
      .then((response) => response.text())
      .then((responseData) => {
        console.log("Response from server:", responseData);
      })
      // Error checks
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  //Add inspect to all local tasks
  function AddInspect() {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) => ({ ...task, inspect: false }))
    );
  }
  //Inspect task value becomes true
  const Inspect = (index) => {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) =>
        i === index ? { ...task, inspect: !task.inspect } : task
      )
    );
  };

  useEffect(() => {
    AddInspect();
    setLocalTaskData(taskData);
  }, []);

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
            <button onClick={() => removeTask(item.Index)}></button>
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

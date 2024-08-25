import { useState, useContext } from "react";
import { TaskContext } from "./TaskProvider";
import { v4 as uuidv4 } from "uuid";

function ToDoCreater() {
  //Seters for the task name and description
  const { taskData, setTaskData } = useContext(TaskContext);
  const { userId, setUserId } = useContext(TaskContext);

  const [TaskName, setTaskName] = useState("");
  const [TaskDescription, setTaskDescription] = useState("");

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDesChange = (event) => {
    setTaskDescription(event.target.value);
  };

  //creating multiple objects
  const addTask = (task, description) => {
    const id = uuidv4();

    // Given to the server and used to create a new task locally in TaskData
    const newTask = {
      TaskId: id,
      Task: task,
      Description: description,
      UserId: userId,
    };
    // Data sent to the server
    sendTaskData(newTask);
    // Data added to the main local task data
    // Previous data and the new task
    const updatedTaskData = [...taskData, newTask];

    return updatedTaskData;
  };

  function sendTaskData(datatosend) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datatosend),
    };

    fetch("http://localhost:5000/api/createToDo", options)
      //Response checks
      .then((response) => response.text())
      .then((responseData) => {
        console.log("Response from server:", responseData);
      })
      //Error checks
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleReset = () => {
    setTaskName("");
    setTaskDescription("");
  };

  return (
    <>
      <div className="Creator">
        <input
          type="text"
          id="HeaderTask"
          placeholder="Task Name"
          value={TaskName}
          onChange={handleTaskNameChange}
        />
        <input
          type="text"
          id="DescriptTask"
          placeholder="Task Description"
          value={TaskDescription}
          onChange={handleTaskDesChange}
        />
        <button
          id="Add"
          onClick={() => setTaskData(addTask(TaskName, TaskDescription))}
        >
          Create
        </button>
        <button id="Reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </>
  );
}

export default ToDoCreater;

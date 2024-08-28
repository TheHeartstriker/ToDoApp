import { useState, useContext } from "react";
import { TaskContext } from "./TaskProvider";
import { v4 as uuidv4 } from "uuid";

function ToDoCreater() {
  //Main task data thats given to the server
  const { taskData, setTaskData } = useContext(TaskContext);
  //User Id thats saved in Login.jsx and sent to the server when creating new tasks
  const { userId, setUserId } = useContext(TaskContext);

  //Seters for the task name and description
  const [TaskName, setTaskName] = useState("");
  const [TaskDescription, setTaskDescription] = useState("");

  //Handles the task name and description changes
  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDesChange = (event) => {
    setTaskDescription(event.target.value);
  };

  //Adds a task to the main data and sends it to the server
  const addTask = (task, description) => {
    // Unique id for each task
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
    const updatedTaskData = [...taskData, newTask];
    return updatedTaskData;
  };
  //Sends the individual task data to the server
  async function sendTaskData(datatosend) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datatosend),
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/createToDo",
        options
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }
  //Reset button on click
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
        <textarea
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

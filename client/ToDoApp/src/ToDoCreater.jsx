import { useState, useContext, useRef, useEffect } from "react";
import { TaskContext } from "./TaskProvider";
import { v4 as uuidv4 } from "uuid";

function ToDoCreater() {
  //Main task data thats given to the server
  const { taskData, setTaskData } = useContext(TaskContext);
  //User Id thats saved in Login.jsx and sent to the server when creating new tasks
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);
  const { foldername, setFoldername } = useContext(TaskContext);

  //Seters for the task name and description
  const [TaskName, setTaskName] = useState("");
  const [TaskDescription, setTaskDescription] = useState("");
  //Ref for the border ani
  const borderRef = useRef(null);
  // For visualzation and to subtly show the user that the task was added
  // Plus is stoping the user from spamming the create button
  function AnimateBorder() {
    return new Promise((resolve) => {
      const border = borderRef.current;
      border.classList.add("animate-border");
      setTimeout(() => {
        border.classList.remove("animate-border");
        resolve();
      }, 1500);
    });
  }

  //Handles the task name and description changes
  const handleTaskNameChange = (event) => {
    if (event.target.value.length > 149) {
      alert("Task name is too long");
      return;
    } else {
      setTaskName(event.target.value);
    }
  };

  const handleTaskDesChange = (event) => {
    setTaskDescription(event.target.value);
  };

  //Adds a task to the main data and sends it to the server
  const addTask = async (task, description) => {
    // Unique id for each task
    const id = uuidv4();

    // Given to the server and used to create a new task locally in TaskData
    const newTask = {
      TaskId: id,
      Task: task,
      Description: description,
      Folder: foldername,
      completed: false,
    };

    await AnimateBorder();

    // Data sent to the server
    if (isSignedIn) {
      sendTaskData(newTask);
    }
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
      credentials: "include",
      body: JSON.stringify(datatosend),
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/createToDo`,
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

  const handleCreate = async () => {
    const updatedTaskData = await addTask(TaskName, TaskDescription);
    setTaskData(updatedTaskData);
  };

  return (
    <>
      <div className="Creator" ref={borderRef}>
        <input
          type="text"
          className="HeaderTask"
          placeholder="Task Name"
          value={TaskName}
          onChange={handleTaskNameChange}
        />
        <textarea
          type="text"
          className="DescriptTask"
          placeholder="Task Description"
          value={TaskDescription}
          onChange={handleTaskDesChange}
        />
        <button className="Add" onClick={handleCreate}>
          Create
        </button>
        <button className="Reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </>
  );
}

export default ToDoCreater;

import { useState, useContext, useRef, useEffect } from "react";
import { TaskContext, Contexts } from "../../Components/TaskProvider";
import { v4 as uuidv4 } from "uuid";
import { taskStuct } from "../../Types/Provider";
import { sendTaskData } from "../../Services/toDoApi";
function ToDoCreater() {
  //Main task data thats given to the server
  const { taskData, setTaskData } = useContext(TaskContext) as Contexts;
  //User Id thats saved in Login.jsx and sent to the server when creating new tasks
  const { foldername, setFoldername } = useContext(TaskContext) as Contexts;

  //Seters for the task name and description
  const [TaskName, setTaskName] = useState<string>("");
  const [TaskDescription, setTaskDescription] = useState<string>("");
  //Ref for the border ani
  const borderRef = useRef<HTMLDivElement>(null);
  // For visualzation and to subtly show the user that the task was added
  // Plus is stoping the user from spamming the create button
  function AnimateBorder(): Promise<void> {
    return new Promise((resolve) => {
      const border = borderRef.current;
      if (!border) {
        resolve();
        return;
      }
      border.classList.add("animate-border");
      setTimeout(() => {
        border.classList.remove("animate-border");
        resolve();
      }, 1500);
    });
  }

  //Handles the task name and description changes
  const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 149) {
      alert("Task name is too long");
      return;
    } else {
      setTaskName(event.target.value);
    }
  };

  const handleTaskDesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTaskDescription(event.target.value);
  };

  //Adds a task to the main data and sends it to the server
  const addTask = async (task: string, description: string) => {
    // Unique id for each task
    const id = uuidv4();

    // Given to the server and used to create a new task locally in TaskData
    const newTask = {
      task_id: id,
      ToDoHeader: task,
      Description: description,
      Folder: foldername,
      Completed: false,
    };

    await AnimateBorder();

    // Data sent to the server
    sendTaskData(newTask);
    // Data added to the main local task data
    const updatedTaskData = [...taskData, newTask];
    return updatedTaskData;
  };

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

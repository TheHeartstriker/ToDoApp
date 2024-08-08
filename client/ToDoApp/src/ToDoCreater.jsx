import { useState, useContext } from "react";
import { TaskContext } from "./TaskProvider";

function ToDoCreater() {
  //Seters for the task name and description
  const { setTaskData, taskData } = useContext(TaskContext);

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
    setTaskData((prevTaskData) => [
      ...prevTaskData,
      { Task: task, index: prevTaskData.length, Description: description },
    ]);
  };

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
        <button id="Add" onClick={() => addTask(TaskName, TaskDescription)}>
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

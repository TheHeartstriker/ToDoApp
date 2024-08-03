import { useState, useEffect } from "react";

function ToDoCreater() {
  const [TaskName, setTaskName] = useState("");
  const [TaskDescription, setTaskDescription] = useState("");

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDesChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const log = () => {
    console.log(TaskName);
    console.log(TaskDescription);
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
        <button id="Add" onClick={log}>
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

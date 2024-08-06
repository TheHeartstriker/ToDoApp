import { useState, useContext } from "react";
import { TaskContext } from "./TaskProvider";

function ToDoCreater() {
  //Seters for the task name and description
  const [TaskName, setTaskName] = useState("");
  const [TaskDescription, setTaskDescription] = useState("");

  const { setTaskData } = useContext(TaskContext);

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDesChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const log = () => {
    setTaskData({ task: TaskName });
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

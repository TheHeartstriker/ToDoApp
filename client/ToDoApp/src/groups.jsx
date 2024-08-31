import { useState, useContext } from "react";
import { TaskContext } from "./TaskProvider";

function Groups() {
  const { Folder, setFolder } = useContext(TaskContext);

  return (
    <>
      <div className="Creator">
        <input type="text" id="HeaderTask" placeholder="Task Name" />
        <textarea
          type="text"
          id="DescriptTask"
          placeholder="Task Description"
        />
        <button id="Add">Create</button>
        <button id="Reset">Reset</button>
      </div>
    </>
  );
}

export default Groups;

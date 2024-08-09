import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskProvider";
function Container() {
  const { taskData, setTaskData } = useContext(TaskContext);

  const removeTask = (index) => {
    setTaskData((prevTaskData) =>
      prevTaskData.filter((t) => t.index !== index)
    );
  };

  function IndexOrgnize() {
    for (let i = 0; i < taskData.length; i++) {
      taskData[i].index = i;
    }
  }

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {taskData.map((item, index) => (
        <div key={item.index} className="grid-item">
          <h1>{item.Task}</h1>
          <p>{item.Description}</p>
          <div className="TaskLeft">
            <button onClick={console.log(item.index)}></button>
          </div>
          <div className="TaskRight">
            <button></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Container;

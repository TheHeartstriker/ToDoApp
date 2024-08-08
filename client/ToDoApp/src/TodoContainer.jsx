import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskProvider";
function Container() {
  const { taskData, setTaskData } = useContext(TaskContext);

  console.log("taskData:", taskData[0]);

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {taskData.map((item, index) => (
        <div key={item.index} className="grid-item">
          <h1>{item.Task}</h1>
          <p>{item.Description}</p>
        </div>
      ))}
    </div>
  );
}

export default Container;

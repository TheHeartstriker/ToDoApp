import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskProvider";
function Container() {
  const { taskData } = useContext(TaskContext);
  const [items, setItems] = useState([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    `${taskData.task}`,
  ]);

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {items.map((item, index) => (
        <div key={index} className="grid-item">
          {item}
        </div>
      ))}
    </div>
  );
}

export default Container;

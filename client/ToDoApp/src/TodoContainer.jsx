import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskProvider";
function Container() {
  const { taskData, setTaskData } = useContext(TaskContext);
  const [items, setItems] = useState([]);
  //Settting the task imditally cause cause a refresh of useEffect causing two items to be added
  useEffect(() => {
    if (taskData.task === "") return;
    console.log("useEffect triggered with taskData.task:", taskData.task);
    setItems([...items, taskData.task]);
  }, []);

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

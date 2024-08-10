import { useState, useEffect, useContext } from "react";
import { TaskContext } from "./TaskProvider";
function Container() {
  //Main task data
  const { taskData, setTaskData } = useContext(TaskContext);
  //Local used so we dont save certain changes like inspect
  const [LocalTaskData, setLocalTaskData] = useState(taskData);

  //Organize local index data
  function IndexOrganize() {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) => ({ ...task, index: i }))
    );
  }
  //Remove task
  const removeTask = (index) => {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.filter((t) => t.index !== index)
    );
    IndexOrganize();
  };
  //Add inspect to all local tasks
  function AddInspect() {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) => ({ ...task, inspect: false }))
    );
  }
  //Inspect task value becomes true
  const Inspect = (index) => {
    setLocalTaskData((prevLocalTaskData) =>
      prevLocalTaskData.map((task, i) =>
        i === index ? { ...task, inspect: !task.inspect } : task
      )
    );
  };

  useEffect(() => {
    console.log("Task Data Updated:", LocalTaskData);
    AddInspect();
    setLocalTaskData(taskData);
  }, [taskData]);

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {LocalTaskData.map((item, index) => (
        <div
          key={item.index}
          className={`grid-item ${item.inspect ? "inspected" : ""}`}
        >
          <h1>{item.Task}</h1>
          <p>{item.Description}</p>
          <div className="TaskLeft">
            <button onClick={() => removeTask(item.index)}></button>
          </div>
          <div className="TaskRight">
            <button onClick={() => Inspect(item.index)}></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Container;

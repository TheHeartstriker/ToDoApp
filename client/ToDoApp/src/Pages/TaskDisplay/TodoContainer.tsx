import { useState, useEffect, useContext } from "react";
import { TaskContext, Contexts } from "../../components/taskProvider";
import { taskStuct } from "../../types/Provider";
import {
  loadTaskData,
  deleteTask,
  updateTaskComplete,
} from "../../services/toDoApi";
import "./task.css";

interface ExtendedTask extends taskStuct {
  inspect?: boolean;
  Index: number;
}

function Container() {
  const [taskData, setTaskData] = useState<ExtendedTask[]>([]);
  const { foldername } = useContext(TaskContext) as Contexts;

  async function fetchTaskData() {
    try {
      const data = await loadTaskData(foldername);
      const extendedData = data.tasks.map((task: taskStuct, i: number) => ({
        ...task,
        inspect: false,
        Index: i,
      }));
      setTaskData(extendedData);
    } catch (error) {
      console.error("Error loading task data:", error);
    }
  }

  function removeTask(index: number, id: string) {
    setTaskData((prevTaskData) =>
      prevTaskData.filter((task) => task.task_id !== id)
    );
    deleteTask(id);
  }

  function Completed(index: number) {
    setTaskData((prevTaskData) =>
      prevTaskData.map((task, i) =>
        i === index ? { ...task, Completed: !task.Completed } : task
      )
    );
    updateTaskComplete(taskData[index].task_id);
  }

  function Inspect(index: number) {
    setTaskData((prevTaskData) =>
      prevTaskData.map((task, i) =>
        i === index ? { ...task, inspect: !task.inspect } : task
      )
    );
  }

  useEffect(() => {
    fetchTaskData();
  }, [foldername]);

  return (
    // This iterates over the items array and renders each item in a div
    <div className="ToDoContainer">
      {taskData.map((item, index) => (
        <div
          key={item.task_id}
          className={`Task ${item.inspect ? "inspected" : ""}`}
        >
          <h3>{item.ToDoHeader}</h3>
          {!item.inspect && (
            <input
              type="checkbox"
              className="CheckBtn"
              checked={item.Completed ?? false}
              onChange={() => Completed(item.Index)}
            />
          )}
          {item.inspect && (
            <button
              className="DeleteBtn"
              onClick={() => removeTask(item.Index, item.task_id)}
            >
              Delete
            </button>
          )}
          {item.inspect && <p>{item.Description}</p>}
          <div className="Inspect">
            <button onClick={() => Inspect(item.Index)}></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Container;

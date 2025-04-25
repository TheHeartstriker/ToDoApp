import { useState, useContext, useRef, useEffect } from "react";
import { TaskContext, Contexts } from "../../components/taskProvider";
import { v4 as uuidv4 } from "uuid";
import { taskStuct } from "../../types/Provider";
import { sendTaskData } from "../../services/toDoApi";
import "./creator.css";
function ToDoCreater() {
  //Main task data thats given to the server
  const [taskData, setTaskData] = useState<taskStuct[]>([]);
  //User Id thats saved in Login.jsx and sent to the server when creating new tasks
  const { foldername, setFoldername } = useContext(TaskContext) as Contexts;

  //Seters for the task name and description
  const [TaskName, setTaskName] = useState<string>("");
  const [TaskDescription, setTaskDescription] = useState<string>("");

  //Handles the task name and description changes
  function handleTaskChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: "name" | "description"
  ) {
    if (setter === "name") {
      setTaskName(event.target.value);
    } else if (setter === "description") {
      setTaskDescription(event.target.value);
    }
  }

  async function addTask(task: string, description: string) {
    // Given to the server and used to create a new task locally in TaskData
    const newTask: taskStuct = {
      task_id: uuidv4(),
      ToDoHeader: task,
      Description: description,
      Folder: foldername,
      Completed: false,
    };
    try {
      // Data sent to the server
      await sendTaskData(newTask);
      handleReset();
    } catch (error) {
      console.error("Error sending task data:", error);
    }
  }
  //Reset button on click
  const handleReset = () => {
    setTaskName("");
    setTaskDescription("");
  };

  return (
    <>
      <div className="Creator">
        <input
          type="text"
          className="headerTask"
          placeholder="Task Name"
          value={TaskName}
          onChange={(event) => handleTaskChange(event, "name")}
        />
        <textarea
          className="DescriptTask"
          placeholder="Task Description"
          value={TaskDescription}
          onChange={(event) => handleTaskChange(event, "description")}
        />
        <div className="btn-container">
          <button
            className="btn_submit"
            onClick={async () => {
              await addTask(TaskName, TaskDescription);
            }}
          >
            Create
          </button>
          <button className="btn_submit" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

export default ToDoCreater;

import React, { createContext, useState } from "react";
//Where data will be loaded and stored for use in the container
//Creates a context
export const TaskContext = createContext();
//Creates a state to store the task data
export const TaskProvider = ({ children }) => {
  const [taskData, setTaskData] = useState([]);

  const addTask = (task, description) => {
    setTaskData((prevTaskData) => [
      ...prevTaskData,
      { Task: task, index: prevTaskData.length, Description: description },
    ]);
  };

  const removeTask = (index) => {
    setTaskData((prevTaskData) =>
      prevTaskData.filter((t) => t.index !== index)
    );
  };

  return (
    <TaskContext.Provider value={{ taskData, setTaskData }}>
      {children}
    </TaskContext.Provider>
  );
};

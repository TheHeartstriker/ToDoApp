import React, { createContext, useState } from "react";
//Creates a context
export const TaskContext = createContext();
//Creates a state to store the task data
export const TaskProvider = ({ children }) => {
  const [taskData, setTaskData] = useState({ task: "" });

  return (
    <TaskContext.Provider value={{ taskData, setTaskData }}>
      {children}
    </TaskContext.Provider>
  );
};

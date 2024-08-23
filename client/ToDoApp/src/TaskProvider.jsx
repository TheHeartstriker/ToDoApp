import React, { createContext, useEffect, useState } from "react";
//Where data will be loaded and stored for use in the container
//Creates a context
export const TaskContext = createContext();
//Creates a state to store the task data
export const TaskProvider = ({ children }) => {
  const [taskData, setTaskData] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState("");

  return (
    <TaskContext.Provider
      value={{
        taskData,
        setTaskData,
        isSignedIn,
        setIsSignedIn,
        userId,
        setUserId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

import React, { createContext, useEffect, useState } from "react";
export const TaskContext = createContext();
export const TaskProvider = ({ children }) => {
  //Main client local task data contains data thats sent to the server
  const [taskData, setTaskData] = useState([]);
  //State to check if the user is logged in usefull across the app
  const [isSignedIn, setIsSignedIn] = useState(false);
  //State to store the user id so we dont have to keep calling the server
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

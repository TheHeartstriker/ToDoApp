import React, { createContext, useEffect, useState } from "react";
//Where data will be loaded and stored for use in the container
//Creates a context
export const TaskContext = createContext();
//Creates a state to store the task data
export const TaskProvider = ({ children }) => {
  //Overhead taskdata that transfers data from the creator to the container
  const [taskData, setTaskData] = useState([]);
  //State to check if the user is logged in usefull across the app
  const [isSignedIn, setIsSignedIn] = useState(false);
  //State to store the user id for sending the data to the server
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

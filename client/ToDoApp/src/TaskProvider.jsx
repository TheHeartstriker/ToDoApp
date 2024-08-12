import React, { createContext, useEffect, useState } from "react";
//Where data will be loaded and stored for use in the container
//Creates a context
export const TaskContext = createContext();
//Creates a state to store the task data
export const TaskProvider = ({ children }) => {
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const data = { id1: "value1", id2: "value2" };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("http://localhost:5000/api", options)
      .then((response) => response.text())
      .then((responseData) => {
        console.log("Response from server:", responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <TaskContext.Provider value={{ taskData, setTaskData }}>
      {children}
    </TaskContext.Provider>
  );
};

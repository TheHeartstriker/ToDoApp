//Ignore for now
import React, { createContext, useEffect, useState, ReactNode } from "react";
//Type definitions for the context
export interface Contexts {
  foldername: string;
  setFoldername: React.Dispatch<React.SetStateAction<string>>;
}
//Small interface for the children
interface TaskProviderProps {
  children: ReactNode;
}
export const TaskContext = createContext<Contexts | undefined>(undefined);

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  //Foldername save so when the user access the container component it will show the correct folder tasks
  const [foldername, setFoldername] = useState<string>("");

  return (
    <TaskContext.Provider
      value={{
        foldername,
        setFoldername,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

import React, { createContext, useEffect, useState, ReactNode } from "react";
import { taskStuct, folderStruct } from "../Types/Provider";
//Type definitions for the context
export interface Contexts {
  taskData: taskStuct[];
  setTaskData: React.Dispatch<React.SetStateAction<taskStuct[]>>;
  foldername: string;
  setFoldername: React.Dispatch<React.SetStateAction<string>>;
  folders: folderStruct[];
  setFolders: React.Dispatch<React.SetStateAction<folderStruct[]>>;
}
//Small interface for the children
interface TaskProviderProps {
  children: ReactNode;
}
export const TaskContext = createContext<Contexts | undefined>(undefined);

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  //Main client local task data contains data thats sent to the server
  const [taskData, setTaskData] = useState<taskStuct[]>([]);
  //Used to store folderdata so it persists when navigating elsewhere
  const [folders, setFolders] = useState<folderStruct[]>([]);
  //Foldername save so when the user access the container component it will show the correct folder tasks
  const [foldername, setFoldername] = useState<string>("");

  return (
    <TaskContext.Provider
      value={{
        taskData,
        setTaskData,
        foldername,
        setFoldername,
        folders,
        setFolders,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

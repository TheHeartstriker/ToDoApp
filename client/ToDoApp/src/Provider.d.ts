//TypeScript type definitions for Provider.tsx
//Task data structure
export interface taskStuct {
  TaskId: id;
  Task: task;
  Description: description;
  Folder: foldername;
  completed: false;
}

export interface folderStruct {
  folderName: folderName;
  folderOn: boolean;
  index: folders;
}

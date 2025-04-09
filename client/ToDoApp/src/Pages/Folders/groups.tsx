import { useState, useContext, useEffect } from "react";
import { TaskContext, Contexts } from "../../Components/TaskProvider";
import { folderStruct } from "../../Types/Provider";
import { GetFolders, deleteFolder } from "../../Services/toDoApi";

function Groups() {
  //Local state for the folder creator screen and the folders indvidual name
  const [ShowFolderCreate, setShowFolderCreate] = useState<boolean>(true);
  const [folderMainName, setFolderMainName] = useState<string>("");
  //Context values
  const { folders, setFolders } = useContext(TaskContext) as Contexts;
  const { foldername, setFoldername } = useContext(TaskContext) as Contexts;

  const handleFolderNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFolderMainName(event.target.value);
  };

  //Add a folder to the local object with realted mete data
  function addFolder(folderName: string) {
    const newFolder: folderStruct = {
      folderName: folderName,
      folderOn: false,
      index: folders.length,
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  }

  //On of to show the folder creator
  function ShowFolder() {
    setShowFolderCreate(!ShowFolderCreate);
  }
  //Delete a folder based on index
  function deleteFolderLocal(index: number) {
    setFolders(folders.filter((folder) => folder.index !== index));
  }
  //If we have been clicked then name of the folder to the overhead
  function CurrentFolder() {
    let folderFound = false;
    folders.forEach((folder) => {
      if (folder.folderOn) {
        setFoldername(folder.folderName);
        folderFound = true;
      }
    });
    //If we have not found a folder then set the foldername to nothing
    if (!folderFound) {
      setFoldername("");
    }
  }
  //Used to change the folderOn value using the index
  function TrueFalseFolder(index: number) {
    const newFolders = folders.map((folder) => {
      if (folder.index === index) {
        return {
          ...folder,
          folderOn: !folder.folderOn,
        };
      } else {
        return {
          ...folder,
          folderOn: false,
        };
      }
    });
    setFolders(newFolders);
  }

  async function fetchAndSetFolders() {
    try {
      const responseData = await GetFolders();
      const data: { folder: string }[] = responseData.folders;
      const folderData: folderStruct[] = data.map((folder, index: number) => {
        const existingFolder = folders.find(
          (f) => f.folderName === folder.folder
        );
        return {
          folderName: folder.folder,
          folderOn: existingFolder ? existingFolder.folderOn : false,
          index: index,
        };
      });
      setFolders(folderData);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  }
  useEffect(() => {
    //This get excludes the default "" folder
    GetFolders();
  }, []);
  //Re checks the folder values and sees if the foldername needs to be updated
  useEffect(() => {
    CurrentFolder();
  }, [folders]);

  return (
    <>
      {folders.map((folder, index) => (
        <div className="Folder" key={folder.folderName}>
          <button
            className={`FolderName ${folder.folderOn ? "FolderNameOn" : ""}`}
            onClick={() => TrueFalseFolder(folder.index)}
          >
            {folder.folderName}
          </button>
          <button
            className="FolderDelete"
            onClick={() => {
              deleteFolderLocal(folder.index);
              deleteFolder(folder.folderName);
            }}
          >
            Delete
          </button>
        </div>
      ))}
      {ShowFolderCreate && (
        <div className="FolderCreate">
          <input
            type="text"
            className="HeaderTask"
            placeholder="FolderName"
            value={folderMainName}
            onChange={handleFolderNameChange}
          />
          <button id="AddFolder" onClick={() => addFolder(folderMainName)}>
            Create
          </button>
          <button id="Clear" onClick={() => ShowFolder()}>
            Clear
          </button>
        </div>
      )}
      {!ShowFolderCreate && (
        <button className="ShowFolderCreate" onClick={() => ShowFolder()}>
          View Creator
        </button>
      )}
    </>
  );
}

export default Groups;
